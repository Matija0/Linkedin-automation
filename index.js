const webdriver = require("selenium-webdriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

const logger = (message) => {
  const timeStamp = new Date().toISOString();
  return () => {
    fs.writeFileSync("application.log", `${message} ${timeStamp}\n`, {
      flag: "a",
    });
  };
};

const signIn = async (driver) => {
  try {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const emailButton = await driver.findElement(
      By.xpath('//*[@id="session_key"]')
    );
    const passwordButton = await driver.findElement(
      By.xpath('//*[@id="session_password"]')
    );

    const signInButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await emailButton.sendKeys(email);
    await passwordButton.sendKeys(password);
    await signInButton.click().then(() => {
      logger("Sign in successful")();
    });
  } catch (error) {
    logger(error.toString())();
  }
};

const addPosition = async (driver) => {
  try {
    const viewProfileButton = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div/div/div[2]/div/div/div/div/div[1]/div[1]/a/div[2]"
      )
    );
    await viewProfileButton.click().then(() => {
      logger("View profile button clicked successfully")();
    });

    const sectionButton = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div/div/div[2]/div/div/main/section[1]/div[2]/div[3]/button"
      )
    );

    await sectionButton.click().then(() => {
      logger("Section button clicked successfully")();
    });

    const addPosition = await driver.findElement(
      By.xpath("/html/body/div[3]/div/div/div[2]/div[1]/div/div[2]/div[4]/a")
    );

    await addPosition.click().then(() => {
      logger("Add position button clicked successfully")();
    });
    const title = "Junior software engineer";
    const company = "Neyho Informatika d.o.o.";

    const titleInput = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[1]/div/div/div/div/input"
      )
    );

    await titleInput.sendKeys(title, Key.ENTER);

    await titleInput.sendKeys(Key.ENTER);

    await titleInput.sendKeys(Key.TAB);

    const employmentSelect = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[2]/div/div/div[1]/select"
      )
    );

    await employmentSelect.click();

    const option = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[2]/div/div/div[1]/select/option[2]"
      )
    );

    await option.click();
    const companyInput = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[3]/div/div/div[1]/div/input"
      )
    );

    await companyInput.sendKeys(company, Key.RETURN);

    const monthOption = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[7]/div/div/div/div[1]/fieldset[1]/div/span[1]/select/option[5]"
      )
    );

    await monthOption.click();

    const yearOption = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[7]/div/div/div/div[1]/fieldset[1]/div/span[2]/select/option[2]"
      )
    );

    await yearOption.click();

    driver.sleep(5000);

    const saveBtn = await driver.findElement(
      By.xpath("/html/body/div[3]/div/div/div[3]/button")
    );

    await saveBtn.click().then(() => {
      logger("Save button clicked successfully")();
    });
    await driver.sleep(5000);
    const exitBtn = await driver.findElement(
      By.xpath("/html/body/div[3]/div/div/button")
    );

    await exitBtn.click();

    driver.sleep(5000);
  } catch (error) {
    logger(error.toString())();
    return;
  }
};

const searchJobs = async (driver) => {
  try {
    const jobsBtn = driver.findElement(
      By.xpath("/html/body/div[6]/header/div/nav/ul/li[3]/a")
    );

    await jobsBtn.click().then(() => {
      logger("Jobs button clicked successfully")();
    });
    await driver.sleep(4000);
    const searchInput = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/header/div/div/div/div[2]/div[2]/div/div/input[1]"
      )
    );

    await searchInput.sendKeys("Software Developer Intern", Key.RETURN);

    await driver.sleep(4000);

    let nextPageExists = true;

    while (nextPageExists) {
      const listOfJobs = await driver.findElements(
        By.xpath(
          "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/div/ul"
        )
      );

      let jobs = [];
      for (const job of listOfJobs) {
        const listItems = await job.findElements(By.xpath("./li"));

        for (const listItem of listItems) {
          await listItem.click();
          await driver.sleep(2000);
          const jobElements = await driver.findElements(
            By.xpath(
              "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[2]/div/div[2]/div/div[1]/div"
            )
          );
          for (const element of jobElements) {
            const titleElement = await element.findElement(
              By.xpath(
                "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[2]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/div[2]/div/h1/a"
              )
            );
            let descriptionElement = await element.findElement(
              By.className("mt4")
            );
            const title = await titleElement.getText();
            const desc = await descriptionElement.getText();
            jobs.push({ title: title, description: desc });
          }
        }
      }

      fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));

      const nextBtns = await driver.findElements(
        By.xpath(
          "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/div/div[4]/button"
        )
      );

      if (nextBtns.length > 0) {
        await nextBtns[0].click();
        await driver.sleep(2000);
      } else {
        nextPageExists = false;
      }
    }

    await driver.sleep(4000);

    const setAlert = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/header/div[2]/div/div/input"
      )
    );

    await setAlert.click().then(() => {
      logger("Set job alert button clicked successfully");
    });
  } catch (error) {
    logger(error.toString())();
    return;
  }
};

const sendMessage = async (driver) => {
  try {
    const messageBtn = await driver.findElement(
      By.xpath("/html/body/div[6]/header/div/nav/ul/li[4]/a")
    );

    await messageBtn.click().then(() => {
      logger("Message button clicked successfully")();
    });

    await driver.sleep(5000);

    //message recipient
    const recipientInput = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div[2]/div/div/main/div/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/section/div/input"
      )
    );
    await recipientInput.sendKeys("Josip Sudar");
    await driver.sleep(5000);
    await recipientInput.sendKeys(Key.RETURN);

    await driver.sleep(2000);

    const messageInput = await driver.findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div[2]/div/div/main/div/div[2]/div[2]/div[1]/div/div[3]/form/div[3]/div/div[1]/div[1]"
      )
    );
    await messageInput.sendKeys(
      "Hi,\n My name is Robert Robotić and this is test message."
    );

    await driver.sleep(2000);
    const sendBtn = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );

    await sendBtn.click().then(() => {
      logger("Send button clicked successfully")();
    });
  } catch (error) {
    logger(error.toString())();
    return;
  }
};

(async function linkedin_worker() {
  let driver;

  try {
    driver = await new Builder()
      .forBrowser("chrome")
      .usingServer("http://localhost:4444/wd/hub")
      .build();
    const url = process.env.URL;

    await driver.get(url); // Open URL
    await driver.manage().setTimeouts({ implicit: 1000 });
    await driver.manage().window().maximize(); // Maximize window

    await signIn(driver);
    await driver.sleep(5000);
    await addPosition(driver);
    await driver.sleep(5000);
    await searchJobs(driver);
    await driver.sleep(5000);
    await sendMessage(driver);
  } catch (error) {
    logger(error.toString())();
  }
})();
