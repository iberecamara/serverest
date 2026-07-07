const { faker } = require("@faker-js/faker");

describe("API - Users", {
  tags: ['@api', '@users']
}, () => {

  it("Validates that Get All User lists all registered users.", {
    tags: ['@all-users']
  }, () => {
    cy.apiGetUsers({ validate: false })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("quantidade");
        expect(response.body).to.have.property("usuarios").and.to.be.an("array");

        if (response.body.usuarios.length > 0) {
          const expectedKeys = ["nome", "email", "password", "administrador", "_id"];
          for (const user of response.body.usuarios) {
            expect(
              user,
              `Each user should have all the mandatory fields: '${expectedKeys}'.`
            ).to.have.all.keys(expectedKeys);
          }
        }
      });
  });

  it("Validates that the complete lifecycle (create -> read -> update -> delete) for a user is supported", {
    tags: ['@user-lifecycle']
  }, () => {
    cy.generateUser().then((user) => {
      let userId;

      cy.apiCreateUser({ user: user, validate: true })
        .then((createUserResponse) => {
          userId = createUserResponse.body._id;

          cy.apiGetUser({ id: userId, validate: true })
            .then((getResponse) => {
              expect(
                getResponse.body.email,
                'Get User by id should return a response with the body containing an email matching the created user'
              ).to.eq(user.email);
              expect(
                getResponse.body.nome,
                'Get User by id should return a response with the body containing a name matching the created user'
              ).to.eq(user.nome);

              const updatedName = faker.person.fullName();
              user.nome = updatedName;
              cy.apiUpdateUser({
                id: userId,
                user: user,
                validate: true
              });

              cy.apiGetUser({
                id: userId,
                validate: true
              }).then((getUpdateUserResponse) => {
                expect(
                  getUpdateUserResponse.body.nome,
                  'Retrieving an user by id after updating the name should return the user with the updated name'
                ).to.eq(updatedName);
              });

              cy.apiDeleteUser({ id: userId, validate: true });
            });
        });
    });
  });

  it("Validates that creating a user with an email that is already registered is not allowed.", {
    tags: ['@duplicated-email']
  }, () => {
    let userId;
    cy.generateUser().then((user) => {
      cy.apiCreateUser({
        user: user,
        validate: true
      }).then((response) => {
        userId = response.body._id;
      });
      cy.apiCreateUser({
        user: user,
        validate: false
      }).then((response) => {
        expect(
          response.status,
          'Creating an user with an email that already exists should return a response with status code 400.'
        ).to.eq(400);
        const errorMessage = 'Este email já está sendo usado';
        expect(
          response.body.message,
          `Creating an user with an email that already exists should return a response with error message '${errorMessage}'.`
        ).to.eq(errorMessage);
        cy.apiDeleteUser({ id: userId, validate: true });
      });
    });
  });
});
