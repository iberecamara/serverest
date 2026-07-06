# ServeRest Cypress Test Automation

Automated test suite built with **Cypress** covering both layers of the
ServeRest practice application:

- **UI (E2E):** https://front.serverest.dev
- **API:** https://serverest.dev

## Stack

- [Cypress](https://www.cypress.io/) 15.x
- Plain JavaScript (no TypeScript required)
- `cy.request()` for API testing, standard Cypress commands for UI testing

## Project structure

```
serverest
├── cypress.config.js          # baseUrl, env vars, timeouts, retries
├── package.json
├── cypress/
│   ├── e2e/
│   │   ├── ui/                 # 4 E2E (front-end) specs
│   │   │   ├── register-user.cy.js
│   │   │   ├── login.cy.js
│   │   │   ├── search-products.cy.js
│   │   │   └── shopping-cart.cy.js
│   │   └── api/                # 4 API specs
│   │       ├── auth.cy.js
│   │       ├── usuarios.cy.js
│   │       ├── products.cy.js
│   │       └── carts.cy.js
│   └── support/
│       ├── e2e.js              # global config / uncaught exception handling
│       └── api.commands.js     # custom commands for API
│       └── common.commands.js  # custom shared commands
│       └── ui.commands.js      # custom commands for UI
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Open the interactive Cypress runner
npm run cy:open

# 3. Or run everything headlessly in the terminal
npm run cy:run
```

### Run only one suite

```bash
npm run test:ui                     # UI / E2E specs only
npm run test:ui:login               # UI / E2E specs only
npm run test:ui:register-user       # UI / E2E specs only
npm run test:ui:search-products     # UI / E2E specs only
npm run test:ui:shopping-cart       # UI / E2E specs only
npm run test:api                    # API specs only
npm run test::auth                  # Auth API specs only
npm run test:api:carts              # Carts API specs only
npm run test:api:products           # Products API specs only
npm run test:api:users              # Users API specs only
```