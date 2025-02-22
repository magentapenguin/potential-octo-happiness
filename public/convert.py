import csv
import json

# Open the CSV
with open('adult-sleep-data.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Write the JSON
with open('adult-sleep-data.json', 'w') as f:
    json.dump(rows, f, indent='\t')