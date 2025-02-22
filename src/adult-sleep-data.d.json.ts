export interface SleepData {
    State: string;
    "Age-Adjusted Prevalence (%)": string;
    "95% Confidence Interval": string;
    Quartile: string;
}

declare const sleepData: SleepData[];
export default sleepData;