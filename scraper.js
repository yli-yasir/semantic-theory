const puppeteer = require("puppeteer");
const fs = require("fs");
const { parse } = require("path");

(async () => {
  const [browser, page] = await initBrowserPage(
    "https://changingminds.org/explanations/theories/theories.htm"
  );

  const root = await scrapeDisciplines(page);
  await scrapeTheories(page, root);

  writeResults(root);

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

/**
 * @param {puppeteer.Page} page
 */
async function scrapeDisciplines(page) {
  console.log("Scraping theory disciplines...");
  const lists = await page.$$("ul");
  const disciplineListHandle = lists[1];
  return await parseList(disciplineListHandle);
}

/**
 * @param {puppeteer.Page} page
 */
async function scrapeTheories(page, disciplines) {
  for (let i = 0; i < disciplines.length; i++) {
    const discipline = disciplines[i];
    await page.goto(discipline.url);
    console.log(`scraping ${discipline.url}...`);
    const theoryListHandle = await page.$("ul");
    discipline.theories = await parseList(theoryListHandle);
  }
}
/**
 *
 * @param {puppeteer.ElementHandle} listHandle
 */
async function parseList(listHandle) {
  const list = await listHandle.$$eval("li", (listItems) => {
    return listItems.map((listItem) => ({
      title: listItem.querySelector("a").innerHTML.trim(),
      url: listItem.querySelector("a").href,
      description: listItem.innerHTML.match(/:(.+)/s)?.[1].trim(),
    }));
  });
  return list;
}

function writeResults(data) {
  console.log("writing results...");
  fs.writeFileSync("scraped.json", JSON.stringify(data));
}
