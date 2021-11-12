const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const [browser, page] = await initBrowserPage(
    "https://changingminds.org/explanations/theories/theories.htm"
  );

  const disciplines = await scrapeDisciplines(page);

  const result = disciplines;
  writeResults(result);
  await browser.close();
})();

async function initBrowserPage(pageUrl) {
  console.log("Starting browser!");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("Going to page!");
  await page.goto(pageUrl);
  return [browser, page];
}

async function scrapeDisciplines(page) {
  console.log("Scraping theory disciplines...");
  const disciplines = await page.$$eval("li", (listItems) => {
    return listItems.map((listItem) => ({
      title: listItem.querySelector("a").innerHTML.trim(),
      url: listItem.querySelector("a").href,
      description: listItem.innerHTML.match(/:(.+)/)[1].trim(),
    }));
  });
  return disciplines;
}

function writeResults(data) {
  fs.writeFileSync("scraped.json", JSON.stringify(data));
}
