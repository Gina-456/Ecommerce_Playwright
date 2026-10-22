# Ecommerce_Playwright

Playwright + TypeScript Automation Framework
============================================

> **A production grade, multi-layer test automation framework** for **Web UI** and **REST API** testing, built with Playwright, TypeScript, and the Page Object Model pattern.

🎯 Overview
-----------

This framework provides a **unified, scalable automation solution** for testing the **OpenCart e-commerce platform** across two layers:

| Layer           | Technology                                  | What We Test                                                                          |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| 🌐 **Web UI**   | Playwright + Page Object Model              | Customer registration, login/logout, product search, add-to-cart, end-to-end shopping |
| 🔌 **REST API** | Playwright `request` fixture + FakeStoreAPI | Products, users, carts, authentication, CRUD workflows, schema validation             |

✨ Key Features
--------------

* ✅ **Page Object Model (POM)** — 8 reusable page classes for clean test code
* ✅ **Custom Test Fixtures** — Type safe dependency injection for all page objects (`fixtures/pageFixtures.ts`)
* ✅ **Multi-Layer Testing** — Web UI + REST API in a single framework
* ✅ **Tag-Based Test Suites** — `@master`, `@sanity`, `@regression`, `@api`, `@end-to-end`, `@datadriven` (filter with `--grep`)
* ✅ **Data-Driven Testing** — CSV, JSON, and Excel test data sources (via `DataReader`)
* ✅ **Random Test Data Generation** — Powered by Faker.js
* ✅ **Schema Validation** — JSON Schema validation for API responses via AJV
* ✅ **Multiple Reporters** — HTML, Allure, JUnit XML, Custom HTML dashboard
* ✅ **Parallel Execution** — Fully parallel test execution with configurable workers

### 📂 Folder Breakdown

| Path              | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `pages/`          | Page Object classes — each encapsulates locators + actions for a page        |
| `fixtures/`       | Custom Playwright test fixtures for type-safe page object injection          |
| `tests/web/`      | Web UI test specs (login, registration, cart, search, etc.)                  |
| `tests/api/`      | REST API test specs against FakeStoreAPI                                     |
| `api/endpoints/`  | Centralized API route definitions                                            |
| `api/schemas/`    | JSON Schema files for API response validation                                |
| `utils/`          | Shared utilities (data generation, readers, custom reporter)                 |
| `testdata/`       | External test data files (CSV, JSON, Excel)                                  |
| `reports/`        | Generated HTML + JUnit reports (`reports/index.html`, `reports/results.xml`) |
| `allure-results/` | Allure-compatible test result files                                          |
| `custom-report/`  | Custom HTML dashboard output (per-run file, see `utils/CustomReporter.ts`)   |
| `test-results/`   | Playwright test artifacts (screenshots, videos, traces)                      |
| `docs/`           | Additional documentation                                                     |
| `prompts/`        | AI prompt templates for test generation                                      |

Tech Stack
----------

| Technology                                                           | Version | Purpose                          |
| -------------------------------------------------------------------- | ------- | -------------------------------- |
| [Playwright](https://playwright.dev/)                                | ^1.64.1 | Browser automation & API testing |
| [TypeScript](https://www.typescriptlang.org/)                        | 5.x     | Type-safe test code              |
| [Node.js](https://nodejs.org/)                                       | 20+     | Runtime                          |
| [Allure Playwright](https://www.npmjs.com/package/allure-playwright) | ^3.14.0 | Allure reporting integration     |
| [Faker.js](https://fakerjs.dev/)                                     | ^10.6.0 | Random test data generation      |
| [AJV](https://ajv.js.org/)                                           | ^8.20.0 | JSON Schema validation           |
| [Luxon](https://moment.github.io/luxon/)                             | ^3.7.2  | Date/time manipulation           |
| [csv-parse](https://www.npmjs.com/package/csv-parse)                 | ^7.0.3  | CSV file parsing                 |
| [xlsx](https://www.npmjs.com/package/xlsx)                           | ^0.18.5 | Excel file parsing               |
| [dotenv](https://www.npmjs.com/package/dotenv)                       | ^18.0.8 | Environment variable management  |

> **Note:** TypeScript itself is not a direct dependency — Playwright bundles its own transpiler, so `.ts` tests/config run with the Playwright test runner directly.

Prerequisites
-------------

Before you begin, ensure you have the following installed:

* **Node.js** v20 or later → [Download](https://nodejs.org/)
* **npm** v9+ (comes with Node.js)
* **Git** → [Download](https://git-scm.com/)
* **Playwright browsers** (installed via setup script)
* **Java 11+** (optional, for Allure reporting) → [Download](https://adoptium.net/)

🚀 Quick Start
--------------

### 1️⃣ Clone the Repository

```shell
git clone <repository-url>
cd Ecommerce_Playwright
```

### 2️⃣ Install Dependencies

```shell
npm install
```

### 3️⃣ Install Playwright Browsers

```shell
npx playwright install --with-deps
```

### 4️⃣ Configure Environment

The repo ships with a ready-to-use `.env` file (already pre-filled with default URLs/credentials). If you don't have one:

```shell
copy .env .env.backup   # or create one from the template below
```

Edit `.env` with your application URLs and credentials (see [Environment Configuration](#-environment-configuration)).

### 5️⃣ Run All Tests

```shell
npx playwright test
```

🔧 Environment Configuration
----------------------------

The framework uses a `.env` file for all configurable settings. A pre-filled `.env` is included in the repo. Template (values shown are the defaults shipped with the repo):

```
# 🌍 ENVIRONMENT
APP_ENV=qa # qa | prod | dev

### 🌐 WEB APP CONFIGURATION ####
# 🔗 WEB APP URL
WEB_APP_URL=http://localhost/opencart/upload/
# WEB_APP_URL=https://tutorialsninja.com/demo/
# WEB_APP_URL=https://awesomeqa.com/ui/

# 🔐 WEB APP LOGIN CREDENTIALS (CREATE YOUR OWN CREDENTIALS)
APP_EMAIL=your-email@example.com
APP_PASSWORD=your-password

# 🛒 PRODUCT DETAILS
PRODUCT_NAME=MacBook
PRODUCT_QUANTITY=1
TOTAL_PRICE=$602.00

### 🔌 API CONFIGURATION ####
# 🔗 API BASE URL
API_BASE_URL=https://fakestoreapi.com

# 👤 API USER DETAILS
USERNAME=mor_2314
PASSWORD=83r5^_
USER_ID=1

# 🛍️ API PRODUCT DETAILS
PRODUCT_ID=1
CART_ID=1
LIMIT=3

# 📅 DATE RANGE
START_DATE=2019-12-10
END_DATE=2020-10-10

# 🔑 BASIC AUTHENTICATION CREDENTIALS (IF REQUIRED)
#BASIC_AUTH_USERNAME=YOUR_USERNAME
#BASIC_AUTH_PASSWORD=YOUR_PASSWORD

# 🔐 API KEY (IF REQUIRED)
#API_KEY=YOUR_API_KEY

# 🎟️ ACCESS TOKEN (IF REQUIRED)
#ACCESS_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN

# 🔄 OAUTH2 CONFIGURATION (IF REQUIRED)
#CLIENT_ID=YOUR_CLIENT_ID
#CLIENT_SECRET=YOUR_CLIENT_SECRET
#AUTHORIZATION_CODE=YOUR_AUTHORIZATION_CODE
#TOKEN_URL=YOUR_TOKEN_URL

# 🔌 API LOGIN CREDENTIALS (FakeStore demo account - avoids USERNAME env collision)
API_USERNAME=mor_2314
API_PASSWORD=83r5^_
```

Test Suites & Tags
------------------

Tests are organized using Playwright's tag system (`@tag-name` in test titles). Tags filter which tests to run via `--grep`.

| Tag           | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| `@master`     | **Master suite** — all critical tests (every test carries it) |
| `@sanity`     | **Sanity checks** — quick smoke tests                         |
| `@regression` | **Full regression** — comprehensive coverage                  |
| `@api`        | **API tests only**                                            |
| `@end-to-end` | **End-to-end scenarios** (e.g. CRUD workflows, full shopping) |
| `@datadriven` | **Data-driven tests**                                         |

> **Note:** The npm convenience scripts (`test:master`, `test:sanity`, ...) documented in older versions are **not** present in this repo's `package.json`. Use `npx playwright test --grep "@tag"` instead.

Running Tests
-------------

### Run All Tests

```shell
npx playwright test
```

### Run by Tag (`--grep`)

```shell
npx playwright test --grep "@sanity"            # Sanity tests only
npx playwright test --grep "@regression"        # Regression tests
npx playwright test --grep "@master @api"       # API tests (all carry @master)
npx playwright test --grep "@datadriven"        # Data-driven tests
npx playwright test --grep "@end-to-end"        # End-to-end scenarios
```

### Run in Headed Mode (with browser visible)

```shell
npx playwright test --headed
```

### Run with Debugging

```shell
npx playwright test --debug    # Opens Playwright Inspector
```

### Run a Single Test File

```shell
npx playwright test tests/web/valid-login-flow.spec.ts
```

### Run with Specific Project / Browser

```shell
npx playwright test --project=chromium
```

### Run with grep (custom tag filter)

```shell
npx playwright test --grep "@sanity"
npx playwright test --grep "@api|@end-to-end"    # Multiple tags
```

📄 Page Object Model
--------------------

The framework uses the **Page Object Model (POM)** pattern to separate test logic from page-specific implementation details.

### How It Works

Each web page gets its own **Page Object class** that encapsulates:

* **Locators** — CSS selectors / Playwright getters for elements
* **Actions** — Methods that perform operations (click, fill, select)
* **Verifications** — Methods that check state (isVisible, getText)

All page objects are injected into tests via the custom fixtures in `fixtures/pageFixtures.ts` (never instantiate them manually).

### Available Page Objects

| Class               | File                         | Key Methods                                                                                                |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `HomePage`          | `pages/HomePage.ts`          | `isHomePageExists()`, `searchProduct()`, `goToLoginPage()`, `goToRegisterPage()`, `clickLogout()`          |
| `LoginPage`         | `pages/LoginPage.ts`         | `login()`, `fillCredentials()`, `loginWithBlankFields()`, `isLoginPageExists()`, `isLoginWarningVisible()` |
| `RegisterPage`      | `pages/RegisterPage.ts`      | `completeRegistration()`, `fillRegistrationForm()`, `submitRegistration()`, `isRegisterPageExists()`       |
| `AccountPage`       | `pages/AccountPage.ts`       | `verifyAccountCreated()`, `isMyAccountExists()`, `isAuthenticatedOptionsVisible()`, `clickLogout()`        |
| `LogoutPage`        | `pages/LogoutPage.ts`        | `verifyLogoutConfirmation()`, `isLogoutPageExists()`, `clickContinue()`                                    |
| `SearchResultsPage` | `pages/SearchResultsPage.ts` | `openProduct()`, `isProductListed()`, `getDisplayedProductName()`, `isSearchResultsPageExists()`           |
| `ProductPage`       | `pages/ProductPage.ts`       | `setQuantity()`, `clickAddToCart()`, `isProductDisplayed()`, `openShoppingCartFromAlert()`                 |
| `CartPage`          | `pages/CartPage.ts`          | `isCartPageExists()`, `isProductPresent()`, `getProductQuantity()`, `getCartTotal()`                       |

🌐 API Testing
--------------

The framework tests the [FakeStoreAPI](https://fakestoreapi.com/) — a free REST API for e-commerce.

### API Layer Structure

    api/
    ├── endpoints/
    │   └── routes.ts          # Centralized route definitions
    └── schemas/
        ├── product_api_schema.json
        ├── user_api_schema.json
        └── cart_api_schema.json

### Route Definitions

All API endpoints are centralized in `api/endpoints/routes.ts`:

```ts
export const Routes = {
  BASE_URL: "https://fakestoreapi.com",
  GET_ALL_PRODUCTS: "/products",
  GET_PRODUCT_BY_ID: "/products/{id}",
  CREATE_PRODUCT: "/products",
  GET_ALL_USERS: "/users",
  GET_ALL_CARTS: "/carts",
  AUTH_LOGIN: "/auth/login",
  // ... more routes
};
```

### API Test Example

```ts
// tests/api/products-api.spec.ts
import { test, expect } from "@playwright/test";
import { Routes } from "../../api/endpoints/routes";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

test("GET - All Products @master @sanity @api", async ({ request }) => {
  const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
  expect(response.status()).toBe(200);

  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);

  products.forEach((product: any) => {
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("title");
    expect(product).toHaveProperty("price");
  });
});
```

### API Test Coverage

| Test File                             | Endpoints Covered                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `tests/api/products-api.spec.ts`      | GET all, GET by ID, limit, sort, categories, category filter, POST/PUT/DELETE |
| `tests/api/users-api.spec.ts`         | GET all, GET by ID, limit, sort, POST/PUT/DELETE                              |
| `tests/api/carts-api.spec.ts`         | GET all, GET by ID, date range, user cart, limit, sort, POST/PUT/DELETE       |
| `tests/api/auth-api.spec.ts`          | POST login (valid / invalid credentials)                                      |
| `tests/api/schema-validation.spec.ts` | JSON Schema validation for products, users, carts                             |
| `tests/api/crud-workflows.spec.ts`    | Full CRUD workflows (product, user, cart)                                     |

###### 1️⃣ Playwright HTML Report

```shell
# Auto-generated after test run
open reports/index.html
```

![22df54b8-ad76-4ed6-a935-a4a3c5f428f2](file:///C:/Users/g6696/OneDrive/Pictures/Typedown/22df54b8-ad76-4ed6-a935-a4a3c5f428f2.png)

### 2️⃣ Allure Report

`allure-results/` is produced automatically by the `allure-playwright` reporter. Generate the static report with the bundled npm script (uses the `allure-commandline` package via npx — no global install needed):

```shell
npm run allure:generate        # generates ./allure-report from ./allure-results
npm run allure:open            # serves ./allure-report locally
npm run allure:serve           # generates + serves ./allure-results on the fly
```

Alternatively, to run the full suite and generate the report in one step:

```shell
npm run report:all
```

![33716263-8253-40b0-83b6-8a7188db4332](file:///C:/Users/g6696/OneDrive/Pictures/Typedown/33716263-8253-40b0-83b6-8a7188db4332.png) 

### 3️⃣ Custom HTML Dashboard

A custom reporter (`utils/CustomReporter.ts`) generates a branded HTML dashboard with:

* Test pass/fail/skip statistics
* Step-by-step execution details
* Screenshot attachments on failure
* Console logs per test step
* Video and trace links
* Timeline and chart visualizations

![c61d0b51-fac4-4a42-bbcf-e0d714ed4f19](file:///C:/Users/g6696/OneDrive/Pictures/Typedown/c61d0b51-fac4-4a42-bbcf-e0d714ed4f19.png)
-------------------------

📋 Coding Guidelines
--------------------

* Follow the **Page Object Model** pattern for all UI interactions
* Use **tags** (`@tag`) to categorize every test
* Write **descriptive test names** and use `test.step()` for multi-step scenarios
* Keep **locators in page objects** — never in test files
* Use **fixtures** for dependency injection — never instantiate page objects manually
* Add **JSDoc comments** to all public methods
* Run `npx playwright test` locally before submitting



Note: Database validation test cases and Git + Jenkins CI/CD integration will be implemented in the next phase.
