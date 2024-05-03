const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

(async function vecernji_worker() {
  let driver;
  try {
    driver = await new Builder()
      .forBrowser("chrome")
      .usingServer("http://localhost:4444/wd/hub")
      .build();
    const url = process.env.URL2;

    await driver.get(url); // Open URL
    await driver.manage().setTimeouts({ implicit: 1000 });
    await driver.manage().window().maximize(); // Maximize window

    await driver.sleep(4000);

    await driver
      .wait(
        until.elementLocated(By.xpath('//*[@id="didomi-notice-agree-button"]')),
        5000
      )
      .click();

    await driver.sleep(4000);

    await driver
      .wait(until.elementLocated(By.xpath('//a[@href="/pretraga"]')), 5000)
      .click();

    await driver.sleep(5000);

    await driver
      .wait(until.elementLocated(By.xpath('//input[@id="searchQuery"]')), 5000)
      .sendKeys("sport", Key.RETURN);

    await driver.sleep(5000);

    const items = await driver.wait(
      until.elementsLocated(By.xpath('//div[@class="card__text"]')),
      5000
    );
    let data = [];

    for (const item of items) {
      const title = await item
        .findElement(By.xpath(".//h3[@class='card__title']"))
        .getText();
      const desc = await item
        .findElement(By.xpath(".//p[@class='card__description']"))
        .getText();

      data.push({ title, desc });
    }

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  } catch (error) {
    fs.writeFileSync("error.log", error.toString());
  }
})();
