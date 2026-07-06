describe("UI - Login", () => {

  let user;
  let userId;

  beforeEach(() => {
    cy.generateUser()
      .then((newUser) => {
        user = newUser;
        cy.apiCreateUser({
          user: user,
          validate: true
        }).then((response) => {
          userId = response.body._id;
        });
      });
    cy.visit("/login");
  });

  afterEach(() => {
    cy.apiDeleteUser({ id: userId });
  });

  it("Validates that an user with valid credentials can login successfully.", () => {
    cy.uiLogin({
      email: user.email,
      password: user.password,
      validate: true
    });
  });

  it("Validates that an user with invalid credentials cannot login successfully.", () => {
    cy.uiLogin({
      email: user.email,
      password: 'invalid_password'
    });
    cy.contains(/email e\/ou senha inv[aá]lidos/i).should("be.visible");
    cy.url().should("include", "/login");
  });

  it("Validates that both email and password are required", () => {
    cy.uiLogin({
      email: null,
      password: null
    });
    cy.contains(/Email é obrigatório/i).should("be.visible");
    cy.contains(/Password é obrigatório/i).should("be.visible");
    cy.url().should("include", "/login");
  });

});
