const { getRandomElement } = require('../../utils/arrays.utils');

describe("UI - Product Search", () => {

  let user;
  let product;

  before(() => {
    cy.generateUser().then((generated) => {
      user = generated;
      cy.apiCreateUser({ user: user, validate: true });
    });

    cy.apiGetProducts({ validate: true })
      .then((response) => {
        product = getRandomElement(response.body.produtos);
      });
  });

  beforeEach(() => {
    cy.visit("/login");
    cy.uiLogin({ email: user.email, password: user.password, validate: true });
  });

  it("Validates that an existing product can be searched by its name.", () => {
    cy.uiSearchProduct({ productName: product.nome, validate: true });
  });

  it("Validates that searching for a noon-existing product returns no results.", () => {
    cy.uiSearchProduct({ productName: product.nome });
    cy.get(".card").should("have.length", 0);
  });

});
