class IRCTCPage {
  constructor(page) {
    this.page = page;

    // LOGIN
    this.loginBtn = page.locator('.search_btn.loginText');
    this.username = page.locator('input[placeholder="User Name"]');
    this.password = page.locator('input[placeholder="Password"]');
    this.signInBtn = page.locator('button:has-text("SIGN IN")');

    // SEARCH
    this.fromStation = page.locator('input[aria-controls="pr_id_1_list"]');
    this.toStation = page.locator('input[aria-controls="pr_id_2_list"]');
    this.dateInput = page.locator('input[formcontrolname="journeyDate"]');
    this.searchBtn = page.getByRole('button', { name: 'Search' });

    // RESULT
    this.trainList = page.locator('.train-heading');
  }

  // 🌐 OPEN WEBSITE
  async navigate() {
    await this.page.goto('https://www.irctc.co.in/nget/train-search');
    await this.page.waitForLoadState('domcontentloaded');

    // close initial popup
    const okBtn = this.page.locator('button:has-text("OK")');
    if (await okBtn.isVisible().catch(() => false)) {
      await okBtn.click();
    }
  }

  // 🔐 LOGIN
  async login(user, pass) {
    await this.loginBtn.click({ force: true });

    await this.username.waitFor();

    await this.username.fill('');
    await this.username.type(user, { delay: 150 });

    await this.password.fill('');
    await this.password.type(pass, { delay: 150 });

    console.log("👉 Enter CAPTCHA manually");

    await this.page.waitForTimeout(20000);

    await this.signInBtn.click({ force: true });

    // wait login complete
    await this.page.waitForTimeout(3000);

    await this.handlePopup();
  }

  // 🔥 SAFE POPUP HANDLER
  async handlePopup() {
    const popup = this.page.locator('app-login');

    if (await popup.isVisible().catch(() => false)) {
      console.log("⚠️ Closing popup");

      await this.page.keyboard.press('Escape');

      const closeBtn = this.page.locator('button.ui-dialog-titlebar-close');

      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      }
    }
  }

  // 📍 SELECT STATION (KEYBOARD METHOD)
  async selectStation(locator, value) {
    await this.handlePopup();

    await locator.waitFor({ state: 'visible', timeout: 20000 });

    await locator.click({ force: true });

    await locator.press('Control+A');
    await locator.press('Backspace');

    await locator.type(value, { delay: 150 });

    await this.page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    await locator.press('ArrowDown');
    await locator.press('Enter');

    await this.page.waitForTimeout(1500);
  }

  // 📅 SELECT DATE (CALENDAR METHOD)
  async setDate(date) {
    const [day, month, year] = date.split('/');

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const targetMonth = monthNames[parseInt(month) - 1];

    await this.handlePopup();

    await this.dateInput.click({ force: true });

    await this.page.waitForSelector('.ui-datepicker', { timeout: 10000 });

    for (let i = 0; i < 12; i++) {
      const currentMonth = await this.page.locator('.ui-datepicker-month').textContent();
      const currentYear = await this.page.locator('.ui-datepicker-year').textContent();

      if (
        currentMonth.trim() === targetMonth &&
        currentYear.trim() === year
      ) break;

      await this.page.click('.ui-datepicker-next');
      await this.page.waitForTimeout(500);
    }

    const dayLocator = this.page.locator(
      `//a[contains(@class,'ui-state-default') and text()='${parseInt(day)}']`
    );

    await dayLocator.waitFor({ timeout: 10000 });
    await dayLocator.click();

    console.log("✅ Date selected");
  }

  async searchTrain(from, to) {
  // FROM
  await this.selectStation(this.fromStation, from);

  // TO
  await this.selectStation(this.toStation, to);

  // 🔥 WAIT for Angular validation
  await this.page.waitForTimeout(3000);

  // 🔥 ENSURE SEARCH BUTTON ENABLED
  await this.searchBtn.waitFor({ state: 'visible' });

  // CLICK SEARCH
  await this.searchBtn.click({ force: true });

  // WAIT RESULT
  await this.trainList.first().waitFor({ timeout: 30000 });

  console.log("✅ Train search successful (default date used)");
}
}

module.exports = { IRCTCPage };