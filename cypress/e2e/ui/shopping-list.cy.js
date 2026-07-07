const { getRandomElement } = require('../../utils/arrays.utils');

describe("UI - Shopping List", {
  tags: ['@ui', '@shopping-list']
}, () => {

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
    cy.url().should("include", "/home");
  });

  it("Validates that Shopping List can be cleaned", {
    tags: ['@clean-shopping-list']
  }, () => {
    cy.uiAddProductToList({ productName: product.nome, validate: true });
    cy.uiClearShoppingList({ validate: true });
  });

  it("Validates that adding a product to Cart from Shopping List displays the Shopping Cart", {
    tags: ['@add-from-shopping-list']
  }, () => {
    cy.uiAddProductToList({ productName: product.nome, validate: true });
    cy.uiAddProductToCartFromShoppingList({ validate: true });
  });

});
