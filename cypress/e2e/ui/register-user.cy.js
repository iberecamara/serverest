const { faker } = require("@faker-js/faker");

describe("UI - User Registration", () => {

  beforeEach(() => {
    cy.visit("/cadastrarusuarios");
  });

  it("Validates that a new normal user can be registered successfully.", () => {
    cy.generateUser()
      .then((user) => {
        cy.registerUserUI({
          name: user.nome,
          email: user.email,
          password: user.password,
          admin: user.administrador,
          validate: true
        });
        cy.loginUI(user.email, user.password);
        cy.url().should("include", "/home");
      });
  });

  it("Validates that a new admin user can be registered successfully.", () => {
    cy.generateUser({ administrador: 'true' })
      .then((user) => {
        cy.registerUserUI({
          name: user.nome,
          email: user.email,
          password: user.password,
          admin: user.administrador,
          validate: true
        });
        cy.loginUI(user.email, user.password);
        cy.url().should("include", "/home");
      });
  });

  it("Validates that a new normal user cannot be registered using an email that already exists.", () => {
    cy.generateUser().then((user) => {
      cy.apiCreateUser({ user: user, validate: true });

      cy.registerUserUI({
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
