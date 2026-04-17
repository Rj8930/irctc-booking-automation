// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: false,
    slowMo: 100,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    }
  },
  timeout: 60000
});