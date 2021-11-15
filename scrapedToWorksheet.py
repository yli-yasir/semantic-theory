import json
from pandas import DataFrame
from dataclasses import make_dataclass

scrapedDataFile = open("scraped.json", encoding="utf-8")

scrapedData = json.load(scrapedDataFile)

Theory = make_dataclass("Theory", [("name", str), ("description", str)])

df = DataFrame([Theory("fat", "eat a lot")])

df.to_excel('test.xlsx', sheet_name='sheet1', index=False)

print(scrapedData[0]["theories"][0])


scrapedDataFile.close()
