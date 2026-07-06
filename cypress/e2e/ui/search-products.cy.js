const { getRandomElement } = require('../../utils/arrays.utils');

describe("UI - Product Search", () => {

  let user;

  before(() => {
    cy.generateUser().then((generated) => {
      user = generated;
      cy.apiCreateUser({ user: user, validate: true });
    });
  });

  beforeEach(() => {
    cy.visit("/login");
    cy.uiLogin({ email: user.email, password: user.password, validate: true });
  });

  it("Validates that an existing product can be searched by its name.", () => {
    cy.apiGetProducts({ validate: true })
      .then((response) => {
        const product = getRandomElement(response.body.produtos);
        cy.uiSearchProduct({ productName: product.nome, validate: true });
      });
  });

  // it("Validates that searching for a non-existing product returns no results.", () => {
  //   cy.uiSearchProduct({ productName: 'invalid product name' });
  //   cy.get(".card").should("have.length", 0);
  // });

});
