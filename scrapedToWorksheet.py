import json
from pandas import DataFrame
from dataclasses import make_dataclass

scrapedDataFile = open("scraped.json", encoding="utf-8")

scrapedData = json.load(scrapedDataFile)

Theory = make_dataclass(
    "Theory", [("name", str), ("title", str), ("description", str), ("category", str)])


theories = []

for category in scrapedData:
    for theory in category["theories"]:
        name = theory["title"].replace(" ", "")
        name = name if name.endswith("Theory") else name + "Theory"
        theories.append(
            Theory(name,
                   theory["title"], theory["details"].get("description", ""), category["title"]))

df = DataFrame(theories)

df.to_excel('theories2.xlsx', sheet_name='sheet1', index=False)


scrapedDataFile.close()
