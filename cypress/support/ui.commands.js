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