const puppeteer = require("puppeteer");

(async () => {
  console.log("Starting browser!");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("Going to page!");
  await page.goto(
    "https://changingminds.org/explanations/theories/theories.htm"
  );

  console.log("Scraping theory disciplines...");
  const theories = await page.$$eval("li", (listItems) => {
    return listItems.map((listItem) => ({
      title: listItem.querySelector("a").innerHTML.trim(),
      description: listItem.innerHTML.match(/:(.+)/)[1].trim(),
    }));
  });

  console.log("Result:");
  console.log(theories);
  await browser.close();
})();
