describe("API - Shopping Carts", () => {

  let user;
  let token;
  let product;
  let products;
  let response;
  let userId;

  before(() => {
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

    cy.apiGetProducts({ validate: true })
      .then((response) => {
        products = response.body.produtos;
        product = products[0];
      });
  });

  beforeEach(() => {
    cy.apiLogin({ email: user.email, password: user.password, validate: true })
      .then((response) => {
        token = response.body.authorization;
        cy.log(`Authorization: ${token}`)
      });
  });

  afterEach(() => {
    cy.apiCancelPurchase({ headers: { Authorization: token } });
    cy.apiDeleteUser({ id: userId });
  });

  it("Validates that a cart is created for the authenticated user with a valid product.", () => {
    cy.apiAddToCart({
      headers: { 'Authorization': token },
      body: {
        produtos: [{ idProduto: product._id, quantidade: 1 }],
      },
      validate: true
    }).then((receivedResponse) => {
      response = receivedResponse;
      cy.apiGetCartProducts({ id: response.body._id })
        .then((products) => {
          const matching = products.some(
            (p) => p.idProduto === product._id
          );
          expect(
            matching,
            `Get Cart Products should have a 'produtos' field containing the at least one product with the 'idProduto' field with the value '${product._id}'.`
          ).to.be.true;
        });
    });
  });

  it("Validates that a user cannot have two open carts at the same time.", () => {
    cy.apiAddToCart({
      headers: { 'Authorization': token },
      body: {
        produtos: [{ idProduto: product._id, quantidade: 1 }],
      },
      validate: true
    }).its("status").should("eq", 201);

    cy.apiAddToCart({
      headers: { 'Authorization': token },
      body: {
        produtos: [{ idProduto: product._id, quantidade: 1 }],
      },
    }).then((response) => {
      expect(
        response.status,
        'Adding a new cart while having an active one should return a response with status code 400.'
      ).to.eq(400);
      const errorMessage = 'Não é permitido ter mais de 1 carrinho';
      expect(
        response.body.message,
        `Adding a new cart while having an active one shoould return a response with the message '${errorMessage}'.`
      ).to.eq(errorMessage);
    });
  });

  it("Validates that cancelling the purchase empties the cart", () => {
    cy.apiAddToCart({
      headers: { 'Authorization': token },
      body: {
        produtos: [{ idProduto: product._id, quantidade: 1 }],
      },
      validate: true
    });

    cy.apiCancelPurchase({
      headers: { 'Authorization': token },
    }).then((response) => {
      expect(
        response.status,
        'Cancelling a cart should return a response with status code 200.'
      ).to.eq(200);
      const message = 'Registro excluído com sucesso';
      expect(
        response.body.message,
        `Cancelling a cart should return a response with a message containing '${message}'.`
      ).to.have.string(message);
    });
  });
});
