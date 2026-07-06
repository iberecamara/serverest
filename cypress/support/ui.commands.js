// UI Login commands
Cypress.Commands.add("uiLogin", ({ email, password, validate = false }) => {
  if (email) {
    cy.get('[data-testid="email"]').type(email);
  }
  if (password) {
    cy.get('[data-testid="senha"]').type(password);
  }
  cy.get('[data-testid="entrar"]').click();
  if (validate) {
    cy.url().should("include", "/home");
    cy.get('[data-testid="logout"]').should('be.visible');
  }
});

// UI Register User commands
Cypress.Commands.add("uiRegisterUser", ({
  name,
  email,
  password,
  admin = 'false',
  validate = false
}) => {
  if (name) {
    cy.get('[data-testid="nome"]').type(name);
  }
  if (email) {
    cy.get('[data-testid="email"]').type(email);
  }
  if (password) {
    cy.get('[data-testid="password"]').type(password);
  }
  if (admin === 'true') {
    cy.get('[data-testid="checkbox"]').check();
  }
  cy.get('[data-testid="cadastrar"]').click();
  if (validate) {
    cy.contains(
      /Cadastro realizado com sucesso/i,
      { timeout: 10000 }
    ).should("be.visible");
  }
});

// UI Products commands
Cypress.Commands.add("uiSearchProduct", ({ productName, validate = false }) => {
  cy.get('[data-testid="pesquisar"]').type(productName);
  cy.get('[data-testid="botaoPesquisar"]').click();
  if (validate) {
    cy.get(".card").should("have.length.greaterThan", 0);
    cy.get(".card").each(($card) => {
      cy.wrap($card).should("contain.text", productName);
    });
  }
});

Cypress.Commands.add("uiAddProductToList", ({ productName, validate = false }) => {
  cy.contains(".card", productName).within(() => {
    cy.contains("button", /Adicionar a lista/i).click();
  });
  if (validate) {
    cy.get('[data-testid="shopping-cart-product-name"]').should("be.visible");
    cy.get('[data-testid="shopping-cart-product-name"]')
      .should('contain.text', productName);
    cy.contains(productName).should("be.visible");
    cy.get('[data-testid="shopping-cart-product-quantity"]')
      .find('p')
      .first()
      .should('have.text', 'Total: 1');
  }
});

// UI Shopping List commands
Cypress.Commands.add("uiAddProductToCartFromShoppingList", ({ validate = false }) => {
  cy.get('[data-testid="adicionar carrinho"]').click();
  if (validate) {
    cy.url().should("include", "/carrinho");
    cy.contains(
      /Em construção aguarde/i
    ).should("be.visible");
  }
});

Cypress.Commands.add("uiClearShoppingList", ({ validate = false }) => {
  cy.get('[data-testid="limparLista"]').click();
  if (validate) {
    cy.url().should("include", "/minhaListaDeProdutos");
    cy.contains(
      /Seu carrinho está vazio/i
    ).should("be.visible");
    cy.get(".card-body").should("have.length", 0);
  }
});