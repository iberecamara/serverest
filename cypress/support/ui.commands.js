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

// UI Search Products commands
Cypress.Commands.add("loginUI", ({ email, password, validate = false }) => {
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