const { faker } = require("@faker-js/faker");
const { tags } = require("allure-cypress");

describe("UI - User Registration", {
  tags: ['@ui', '@user', '@user-registration']
}, () => {

  beforeEach(() => {
    cy.visit("/cadastrarusuarios");
  });

  it("Validates that a new normal user can be registered successfully.", {
    tags: ['@common-user']
  }, () => {
    cy.generateUser()
      .then((user) => {
        cy.uiRegisterUser({
          name: user.nome,
          email: user.email,
          password: user.password,
          admin: user.administrador,
          validate: true
        });
        cy.uiLogin(user.email, user.password);
        cy.url().should("include", "/home");
      });
  });

  it("Validates that a new admin user can be registered successfully.", {
    tags: ['@admin-user']
  }, () => {
    cy.generateUser({ administrador: 'true' })
      .then((user) => {
        cy.uiRegisterUser({
          name: user.nome,
          email: user.email,
          password: user.password,
          admin: user.administrador,
          validate: true
        });
        cy.uiLogin(user.email, user.password);
        cy.url().should("include", "/home");
      });
  });

  it("Validates that a user cannot be registered using an email that already exists.", {
    tags: ['@duplicated-email', '@user-registration-error']
  }, () => {
    cy.generateUser().then((user) => {
      cy.apiCreateUser({ user: user, validate: true });

      cy.uiRegisterUser({
        name: faker.person.fullName(),
        email: user.email,
        password: faker.internet.password(),
      });

      cy.contains(
        /Este email já está sendo usado/i
      ).should("be.visible");
      cy.url().should("include", "/cadastrarusuarios");

    });
  });
});
