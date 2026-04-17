const { test } = require('@playwright/test');
const { IRCTCPage } = require('../pages/irctcPage');
const { passenger_data } = require('../config/passenger_data');

test('IRCTC Login + Train Search', async ({ page }) => {
  const irctc = new IRCTCPage(page);

  //  OPEN WEBSITE
  await irctc.navigate();

  //  LOGIN
  await irctc.login(
    passenger_data.USERNAME,
    passenger_data.PASSWORD
  );

  //  WAIT AFTER LOGIN (VERY IMPORTANT)
  await page.waitForTimeout(3000);

  //  SEARCH TRAIN
  await irctc.searchTrain(
  passenger_data.SOURCE_STATION,
  passenger_data.DESTINATION_STATION,
  passenger_data.TRAVEL_DATE

  );

  //  KEEP BROWSER OPEN (DEBUG PURPOSE)
  await page.waitForTimeout(15000);
});