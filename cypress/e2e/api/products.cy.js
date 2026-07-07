const { faker } = require("@faker-js/faker");

describe("API - Products", {
  tags: ['@api', '@products']
}, () => {

  let token;

  it("Validate that Get All Products returns the list of existing products.", {
    tags: ['@all-products']
  }, () => {
    cy.apiGetProducts(
      { validate: true }
    ).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("quantidade");
      expect(response.body).to.have.property("produtos").and.to.be.an("array");

      if (response.body.produtos.length > 0) {
        const expectedKeys = ["nome", "preco", "descricao", "quantidade", "_id"];
        for (const sample of response.body.produtos) {
          expect(
            sample,
            `Each product should have all the mandatory fields: '${expectedKeys}'.`
          ).to.include.all.keys(expectedKeys);
          expect(
            sample.preco,
            "The 'preco' field for the product should be a number."
          ).to.be.a("number");
        }
      }
    });
  });

  it("Validates that Create Product without the Authorization token should not be allowed.", {
    tags: ['@create-product', '@invalid-authorization']
  }, () => {
    cy.apiCreateProduct({
      body: {
        nome: faker.commerce.product(),
        preco: faker.commerce.price(),
        descricao: 'Should not be created',
        quantidade: 1,
      },
    }).then((response) => {
      expect(
        response.status,
        'Create Product without the Authorization token should return a response with status code 401.'
      ).to.eq(401);
      const errorMessage = 'Token de acesso ausente, inválido, expirado';
      expect(
        response.body.message,
        `Create Product without the Authorization token should return a response with the message '${errorMessage}'.`
      ).to.have.string(errorMessage);
    });
  });

  it("Validates that an authenticated admin can create and delete a product.", {
    tags: ['@create-product', '@delete-product']
  }, () => {
    let userId;
    let productId;
    cy.generateUser({ administrador: "true" })
      .then((admin) => {
        cy.apiCreateUser({ user: admin, validate: true }).then((createUserResponse) => {
          token = createUserResponse.body.authorization;
          userId = createUserResponse.body._id;
        });

        cy.apiLogin({ email: admin.email, password: admin.password })
          .then((loginResponse) => {
            token = loginResponse.body.authorization;
            const newProduct = {
              nome: faker.commerce.productName(),
              preco: faker.commerce.price({ dec: 0 }),
              descricao: faker.commerce.productDescription(),
              quantidade: faker.number.int({ min: 1, max: 200 })
            };
            cy.apiCreateProduct({
              headers: { 'Authorization': token },
              body: newProduct
            }).then((createProductResponse) => {
              expect(
                createProductResponse.status,
                'Create Product with a valid Authorization token should return a response with status code 201.'
              ).to.eq(201);
              const message = 'Cadastro realizado com sucesso';
              expect(
                createProductResponse.body.message,
                `Create Product with a valid Authorization token should return a response with the message '${message}'.`
              ).to.eq(message);
              productId = createProductResponse.body._id;

              cy.apiGetProduct({ id: productId })
                .then((getProductResponse) => {
                  expect(
                    getProductResponse.status,
                    'Get Product by id should return a response with status code 200.'
                  ).to.eq(200);
                  expect(
                    getProductResponse.body.nome,
                    "Get Product by id should return a response with a 'nome' field matchin the created product name."
                  ).to.eq(newProduct.nome);
                });
              cy.apiDeleteProduct({
                id: productId,
                headers: { 'Authorization': token },
              }).then((deleteProductResponse) => {
                expect(
                  deleteProductResponse.status,
                  'Delete Product with a valid Authorization token should return a response with status code 200.').to.eq(200);
                const message = 'Registro excluído com sucesso';
                expect(
                  deleteProductResponse.body.message,
                  `Delete Product with a valid Authorization token should return a response with the message '${message}'.`
                ).to.eq(message);
              });
              cy.apiDeleteUser({
                id: admin._id,
                headers: { 'Authorization': token },
                validate: true
              });
            });
          });
      });
  });
});
