import { Chart, CategoryScale, registerables } from 'chart.js';
import { ChoroplethController, ColorScale, GeoFeature, ProjectionScale } from 'chartjs-chart-geo';
import { feature } from 'topojson-client';
import usAtlas from 'us-atlas/states-10m.json';
import sleepData from './adult-sleep-data.json';

console.log(sleepData)

// Register the controller, element, and scale
Chart.register(ChoroplethController, GeoFeature, CategoryScale, ProjectionScale, ColorScale, ...registerables);

const ctx = document.getElementById('sleepData-us') as HTMLCanvasElement;

const us = feature(usAtlas, usAtlas.objects.states) as any;

const data = us.features.map((d: any) => {
    const statedata = sleepData.filter((s: any) => s["State"] === d.properties.name);
    console.log(statedata)
    const data = parseFloat(statedata.length > 0 ? statedata[0]["Age-Adjusted Prevalence (%)"] : 'NaN');
    if (isNaN(data)) {
        console.warn(`Invalid data for ${d.properties.name}`);
    }
    return ({
        feature: d,
        value: data,
    })
});

const avg = sleepData.map((d: any) => parseFloat(d["Age-Adjusted Prevalence (%)"])).reduce((a: number, b: number) => a + b, 0) / sleepData.length;
document.getElementById('avg-sleep').innerText = avg.toFixed(1);

const dynamicSleepInfo = document.getElementById('sleep-data-dynamic') as HTMLDivElement;
const makeSleepWords = (avg: number) => {
    console.log(avg)
    if (isNaN(avg)) {
        return 'No data available';
    }
    if (avg < 30) {
        return 'Most people in the U.S. are getting a healthy amount of sleep!';
    }
    if (avg < 35) {
        return 'Most people in the U.S. are getting a good amount of sleep.';
    }
    if (avg < 40) {
        return 'Most people in the U.S. are getting an okay amount of sleep.';
    }
    if (avg < 45) {
        return 'Most people in the U.S. are getting a poor amount of sleep.';
    }
    return 'Most people in the U.S. are getting a very poor amount of sleep.';
}
const makeSleepInfo = (avg: number) => {
    const worst = sleepData.reduce((a: any, b: any) => parseFloat(a["Age-Adjusted Prevalence (%)"]) > parseFloat(b["Age-Adjusted Prevalence (%)"]) ? a : b);
    const best = sleepData.reduce((a: any, b: any) => parseFloat(a["Age-Adjusted Prevalence (%)"]) < parseFloat(b["Age-Adjusted Prevalence (%)"]) ? a : b);
    return `${makeSleepWords(avg)}
    The worst state: ${worst["State"]}, <span class="font-condensed">(${worst["Age-Adjusted Prevalence (%)"]}%)</span> and 
    the best state: ${best["State"]}. <span class="font-condensed">(${best["Age-Adjusted Prevalence (%)"]}%)</span>`;
}

dynamicSleepInfo.innerHTML = makeSleepInfo(avg);


new Chart(ctx, {
    type: 'choropleth',
    data: {
        labels: us.features.map((d: any) => d.properties.name),
        datasets: [{
            label: 'U.S. Sleep Data',
            data: data,
        }]
    },
    options: {
        scales: {
            projection: {
                axis: 'x',
                projection: 'albersUsa',
                backgroundColor: 'lightgrey',
            },
            color: {
                axis: 'x',
                legend: {
                    position: 'bottom-right',
                    align: 'right',
                },
                interpolate: (v) => `rgba(${v*255}, 0, ${255-v*255})`,
            },
        },
    }
});
