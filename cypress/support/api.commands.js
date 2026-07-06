const { faker } = require("@faker-js/faker");
const usersApiUrl = Cypress.expose("usersApiUrl");
const loginApiUrl = Cypress.expose("loginApiUrl");
const productsApiUrl = Cypress.expose("productsApiUrl");
const cartsApiUrl = Cypress.expose("cartsApiUrl");
const cancelPurchaseApiUrl = Cypress.expose("cancelPurchaseApiUrl");

// Login API commands
Cypress.Commands.add("apiLogin", ({ email, password, validate = false }) => {
  return cy
    .request({
      method: "POST",
      url: loginApiUrl,
      body: { email, password },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (validate) {
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
      }
      return response;
    });
});

// User API commands
Cypress.Commands.add("apiCreateUser", ({ user, validate = false }) => {
  return cy.request({
    method: 'POST',
    url: usersApiUrl,
    body: user,
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        "Create User response status code should be 201."
      ).to.eq(201);
      const field = 'message';
      const value = 'Cadastro realizado com sucesso';
      expect(
        response.body,
        `Create User response body should have a '${field}' field.'`
      ).to.have.property(field);
      expect(
        response.body.message,
        `Create User response body '${field}' field should have the value '${value}'.`
      ).to.eq(value);
    }
    return {
      status: response.status,
      body: response.body
    }
  });
});

Cypress.Commands.add("apiUpdateUser", ({ id, user, headers = {}, validate = false }) => {
  return cy.request({
    method: 'PUT',
    url: `${usersApiUrl}/${id}`,
    headers: headers,
    body: user,
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        "Update User response status code should be 200."
      ).to.eq(200);
      const field = 'message';
      const value = 'Registro alterado com sucesso';
      expect(
        response.body,
        `Update User response body should have a '${field}' field.'`
      ).to.have.property(field);
      expect(
        response.body.message,
        `Update User response body '${field}' field should have the value '${value}'.`
      ).to.eq(value);
    }
    return {
      status: response.status,
      body: response.body
    }
  });
});

Cypress.Commands.add("apiGetUsers", ({ validate = false }) => {
  cy.request({
    method: 'GET',
    url: usersApiUrl,
    failOnStatusCode: false,
  })
    .then((response) => {
      if (validate) {
        expect(
          response.status,
          "Get Users response status code should be 200."
        ).to.eq(200);
        let field = 'quantidade';
        expect(
          response.body,
          `Get Users response body should have a '${field}' field.'`
        ).to.have.property(field);
        field = 'usuarios';
        expect(
          response.body,
          `Get Users response body should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.usuarios.length,
          `Get Users response body '${field}' field should be an array.`
        ).to.be.an("array");
      }
      return response;
    });
});

Cypress.Commands.add("apiGetUser", ({ id, validate = false }) => {
  cy.request({
    method: 'GET',
    url: `${usersApiUrl}/${id}`,
    failOnStatusCode: false,
  })
    .then((response) => {
      if (validate) {
        expect(
          response.status,
          "Get User response status code should be 200."
        ).to.eq(200);
        let field = 'email';
        expect(
          response.body,
          `Get User response body should have a '${field}' field.'`
        ).to.have.property(field);
        field = 'nome';
        expect(
          response.body,
          `Get User response body should have a '${field}' field.'`
        ).to.have.property(field);
      }
      return response;
    });
});

Cypress.Commands.add("apiDeleteUser", (id, token, validate = false) => {
  return cy.request({
    method: "DELETE",
    url: `${usersApiUrl}/${id}`,
    headers: token ? { Authorization: token } : {},
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        'Delete User with a valid Authorization token should return a response with status code 200.').to.eq(200);
      const message = 'Registro excluído com sucesso';
      expect(
        response.body.message,
        `Delete User with a valid Authorization token should return a response with the message '${message}'.`
      ).to.eq(message);
    }
  });
});


// Products API commands
Cypress.Commands.add("apiGetProducts", ({ validate = false }) => {
  cy.request({
    method: 'GET',
    url: productsApiUrl,
    failOnStatusCode: false,
  })
    .then((response) => {
      if (validate) {
        expect(
          response.status,
          "Get Products response status code should be 200."
        ).to.eq(200);
        const field = 'produtos';
        expect(
          response.body,
          `Get Products response body should have a '${field}' field.'`
        ).to.have.property(field);
        expect(
          response.body.produtos,
          `Get Products response body '${field}' field should be an array.`
        ).to.be.an("array");
      }
      return response;
    });
});

Cypress.Commands.add("apiGetProduct", ({ id, validate = false }) => {
  cy.request({
    method: 'GET',
    url: `${productsApiUrl}/${id}`,
    failOnStatusCode: false,
  })
    .then((response) => {
      if (validate) {
        expect(
          response.status,
          "Get Products response status code should be 200."
        ).to.eq(200);
      }
      return response;
    });
});

Cypress.Commands.add("apiCreateProduct", ({ headers = {}, body = {}, validate = false }) => {
  cy.request({
    method: "POST",
    url: productsApiUrl,
    headers: headers,
    body: body,
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        'Create Product with a valid Authorization token should return a response with status code 201.'
      ).to.eq(201);
      const message = 'Cadastro realizado com sucesso';
      expect(
        response.body.message,
        `Create Product with a valid Authorization token should return a response with the message '${message}'.`
      ).to.eq(message);
    }
    return response;
  });
});

Cypress.Commands.add("apiDeleteProduct", ({ id, headers = {}, validate = false }) => {
  cy.request({
    method: "DELETE",
    url: `${productsApiUrl}/${id}`,
    headers: headers,
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        'Delete Product with a valid Authorization token should return a response with status code 200.').to.eq(200);
      const message = 'Registro excluído com sucesso';
      expect(
        response.body.message,
        `Delete Product with a valid Authorization token should return a response with the message '${message}'.`
      ).to.eq(message);
    }
    return response;
  });
});

// Carts API commands
Cypress.Commands.add("apiGetCartProducts", ({ id }) => {
  cy.request({
    method: 'GET',
    url: `${cartsApiUrl}/${id}`,
    failOnStatusCode: false,
  })
    .then((response) => {
      expect(
        response.status,
        "Get Cart Products response status code should be 200."
      ).to.eq(200);
      return response.body.produtos;
    })
});

Cypress.Commands.add("apiAddToCart", ({ headers = {}, body = {}, validate = false }) => {
  cy.request({
    method: "POST",
    url: cartsApiUrl,
    headers: headers,
    body: body,
    failOnStatusCode: false,
  }).then((response) => {
    if (validate) {
      expect(
        response.status,
        "Add Product to Cart response status code should be 201."
      ).to.eq(201);
      let field = "message";
      let value = "Cadastro realizado com sucesso";
      expect(
        response.body,
        `Add Product to Cart response body should have a '${field}' field.'`
      ).to.have.property(field);
      expect(
        response.body.message,
        `Add Product to Cart '${field}' field should have the value '${value}'.`
      ).to.eq(value);
      field = '_id';
      expect(
        response.body,
        `Add Product to Cart response body should have a '${field}' field.'`
      ).to.have.property(field);
    }
    return response;
  });
});

Cypress.Commands.add("apiCancelPurchase", ({ headers = {} }) => {
  cy.request({
    method: "DELETE",
    url: cancelPurchaseApiUrl,
    headers: headers,
    failOnStatusCode: false,
  }).then((response) => {
    return response;
  });
});