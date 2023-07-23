const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");

suite(
  function () {
    describe("Asset validation", async function () {
      let driver;

      before(async function () {
        driver = await new Builder().forBrowser("chrome").build();

        await driver.get("http://localhost:3000");
      });

      after(async () => await driver.quit());

      it("Add new asset but the code already exists", async function () {
        // Click on "Add new asset button"
        await driver
          .findElement(By.xpath("//button[text()='Add new asset']"))
          .click();

        // Fill code input with an existing code in list
        await driver.findElement(By.name("code")).sendKeys("PLANT_SDO23SBK");

        // Submit form
        await driver.findElement(By.xpath("//button[text()='Add']")).click();

        // Get the error message
        const errorMessage = await driver
          .findElement(By.className("text-danger"))
          .getText();

        // Check if error message is correct
        assert.equal("This asset code already exists.", errorMessage);
      });

      it("Add new asset successfully", async function () {
        const newCode = "PLANT_JON28ETR";

        // Get code input and clear it
        const codeInput = await driver.findElement(By.name("code"));
        codeInput.clear();

        // Fill all form fields correctly
        await codeInput.sendKeys(newCode);
        await driver.findElement(By.name("activationOffset")).sendKeys(5);
        await driver
          .findElement(By.name("contact.email"))
          .sendKeys("madeleine.racicot@mail.com");
        await driver
          .findElement(By.name("contact.phoneNumber"))
          .sendKeys("0278654215");

        // Submit form
        await driver.findElement(By.xpath("//button[text()='Add']")).click();

        // Get the first table cell
        const firstTableCell = await driver
          .findElement(By.xpath("//td"))
          .getText();

        // Check if the new asset code is here
        assert.equal(newCode, firstTableCell);
      }).timeout(5000);
    });
  },
  { browsers: [Browser.CHROME] },
);
