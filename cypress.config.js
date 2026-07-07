import { allureCypress } from "allure-cypress/reporter";
const { defineConfig } = require("cypress");
const installLogsPrinter = require("cypress-terminal-report/src/installLogsPrinter");
const fs = require('node:fs');

const baseApiUrl = "https://serverest.dev";
const loginApiUrl = `${baseApiUrl}/login`;
const usersApiUrl = `${baseApiUrl}/usuarios`;
const productsApiUrl = `${baseApiUrl}/produtos`;
const cartsApiUrl = `${baseApiUrl}/carrinhos`;
const cancelPurchaseApiUrl = `${cartsApiUrl}/cancelar-compra`;

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  retries: 0,

  e2e: {
    baseUrl: "https://front.serverest.dev",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    video: true,
    screenshotsFolder: "artifacts/screenshots",
    videosFolder: "artifacts/videos",
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "artifacts/reports/allure/allure-results",
      });
      installLogsPrinter(on, {
        printLogsToFile: 'always',
        includeSuccessfulHookLogs: true,
        outputRoot: config.projectRoot,
        outputTarget: {
          'artifacts/logs/test-automation.log': 'txt',
        }
      });
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const failures = results.tests.some(
            test => test.attempts.some(attempt => attempt.state === 'failed')
          );
          if (!failures) {
            fs.unlinkSync(results.video);
          }
        }
      });
      return config;
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },

  expose: {
    baseApiUrl: baseApiUrl,
    loginApiUrl: `${baseApiUrl}/login`,
    usersApiUrl: `${baseApiUrl}/usuarios`,
    productsApiUrl: `${baseApiUrl}/produtos`,
    cartsApiUrl: `${baseApiUrl}/carrinhos`,
    cancelPurchaseApiUrl: `${cartsApiUrl}/cancelar-compra`,
  },
});
