describe("API - Authentication", () => {

  let user;

  before(() => {
    cy.generateUser()
      .then((newUser) => {
        user = newUser;
        cy.apiCreateUser({ user: user, validate: true });
      });
  });

  it("Validates that authentication happens successfully with valid credentials.", () => {
    cy.apiLogin({ email: user.email, password: user.password })
      .then((response) => {
        expect(
          response.status,
          'User Login response status code should be 200.'
        ).to.eq(200);
        let field = 'message';
        const value = 'Login realizado com sucesso';
        expect(
          response.body,
          `User Login response body should have a '${field}' field with the value '${value}'.'`
        ).to.have.property(field, value);
        field = "authorization";
        expect(
          response.body,
          `User Login response body should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.authorization,
          `User Login response body '${field}' should start with the value 'Bearer'.`
        ).to.match(/^Bearer\s.+/);
      });
  });

  it("Validates that authentication with an incorrect password returns an error response.", () => {
    cy.apiLogin({ email: user.email, password: "invalid password" })
      .then((response) => {
        expect(
          response.status,
          'User Login response code for a payload with invalid password should be 401.'
        ).to.eq(401);

        let field = 'message';
        let value = 'Email e/ou senha inválidos';
        expect(
          response.body,
          `User Login response body for a payload with invalid password should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.message,
          `User Login response body for a payload with invalid password '${field}' field shoudl have the value '${value}'.`
        ).to.eq(value);
      });
  });

  it("Validates that authentication without email and password returns an error message.", () => {
    cy.apiLogin({})
      .then((response) => {
        expect(
          response.status,
          'User Login response code for a payload without email and password should be 400.'
        ).to.eq(400);
        let field = 'email';
        let value = 'email é obrigatório';
        expect(
          response.body,
          `User Login response body for a payload without email and password should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.email,
          `User Login response body for a payload without email and password '${field}' field shoudl have the value '${value}'.`
        ).to.eq(value);
        field = 'password';
        value = 'password é obrigatório';
        expect(
          response.body,
          `User Login response body for a payload without email and password should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.password,
          `User Login response body for a payload without email and password '${field}' field shoudl have the value '${value}'.`
        ).to.eq(value);
      });
  });
});
