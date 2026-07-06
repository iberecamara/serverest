const { faker } = require("@faker-js/faker");

Cypress.Commands.add("generateUser", (overrides = {}) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName: firstName, lastName: lastName });
  const password = faker.internet.password();
  return {
    nome: `${firstName} ${lastName}`,
    email: email,
    password: password,
    administrador: "false",
    ...overrides,
  };
});