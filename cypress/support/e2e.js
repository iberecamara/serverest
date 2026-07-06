import "allure-cypress";
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector';
import "./api.commands";
import "./common.commands";
import "./ui.commands";

// API URLs
const usersApiUrl = Cypress.expose("usersApiUrl");
const loginApiUrl = Cypress.expose("loginApiUrl");
const productsApiUrl = Cypress.expose("productsApiUrl");
const cartsApiUrl = Cypress.expose("cartsApiUrl");
const cancelPurchaseApiUrl = Cypress.expose("cancelPurchaseApiUrl");

installLogsCollector({
  enableExtendedCollector: true // 👈 Activates tracking for before/after hooks
});

Cypress.on("uncaught:exception", () => {
  return false;
});
