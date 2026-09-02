# Playwright Automation Framework — SauceDemo & Simple Books API

## 1. Project Title
**Playwright Automation Framework (TypeScript + Page Object Model)** covering
the SauceDemo web UI and the Simple Books REST API.

## 2. Project Description
A clean, maintainable Playwright + TypeScript test suite that automates the
SauceDemo login and checkout flows and the Simple Books API order lifecycle.
It showcases the Page Object Model design pattern, data-driven execution,
cross-browser testing (Chromium + Firefox), custom Playwright fixtures, and
GitHub Actions CI.

## 3. Prerequisites
| Tool | Version |
|---|---|
| Node.js | `22.x` (tested on 22.23.2) |
| npm | `10.x` or `12.x` (tested on 12.0.2) |
| Git | any recent version |

## 4. Setup & Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Ghaidaa-Alrawad/Technical-Assessment.git
   cd Technical-Assessment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install the Playwright browsers used by the suite (Chromium + Firefox):
   ```bash
   npx playwright install chromium firefox
   ```

## 5. Running Tests
| What you want | Command |
|---|---|
| All tests (UI + API), both browsers | `npm test` (or `npx playwright test`) |
| UI only | `npm run test:ui` |
| API only | `npm run test:api` |
| Both UI & API | `npm run test:all` |
| Headed mode (watch the browser) | `npm run test:headed` |
| Single browser | `npx playwright test --project=chromium` |
| TypeScript type-check only | `npx tsc --noEmit` |

## 6. Architecture Structure
```
Technical-Assessment/
├─ src/
│  ├─ pages/                 # Page Object Models
│  │  ├─ base.page.ts        #   shared BasePage
│  │  ├─ login.page.ts       #   SauceDemo login form + error handling
│  │  ├─ products.page.ts    #   inventory + add-to-cart + dynamic price logic
│  │  ├─ cart.page.ts        #   shopping cart
│  │  └─ checkout.page.ts    #   checkout info form + summary + totals + finish
│  ├─ api/
│  │  └─ simple-books-api.client.ts  # Simple Books API client (register, orders)
│  ├─ utils/
│  │  ├─ random-data.ts      # random strings / emails / numbers (dynamic data)
│  │  └─ print.ts            # pretty-print request/response payloads
│  ├─ fixtures/
│  │  ├─ fixtures.ts         # custom fixtures injecting UI page objects
│  │  └─ api.fixtures.ts     # custom fixture injecting the API client
│  └─ test-data/
│     ├─ ui-login.data.json        # external UI test data (data-driven)
│     └─ simple-books-api.data.json  # external API test data
├─ tests/
│  ├─ ui/                    # UI test scenarios
│  │  ├─ login.spec.ts       # TC_UI_001 + TC_UI_002 (data-driven)
│  │  └─ checkout.spec.ts    # TC_UI_003
│  └─ api/
│     └─ simple-books-api.spec.ts  # TC_API_001 + TC_API_002
├─ global-setup.ts           # logs suite start
├─ global-teardown.ts        # logs suite completion
├─ .github/workflows/
│  └─ playwright.yml         # CI/CD pipeline (push to main + scheduled)
├─ playwright.config.ts      # runner config (projects, reporters, testIdAttribute)
└─ README.md
```

## 7. Test Scenarios

### UI Test Cases — SauceDemo (`https://www.saucedemo.com/`)
| TC ID | Module | Test Name | Verifications |
|---|---|---|---|
| TC_UI_001 | Login | Valid Login | Successful login with `standard_user` navigates to the Products page |
| TC_UI_002 | Login | Data-Driven Invalid Login Validation | 3 scenarios from JSON: no username, no password, invalid credentials — each asserts the correct validation error |
| TC_UI_003 | Checkout | End-to-End Checkout Flow | Add the two most expensive products (dynamic logic), verify cart, fill checkout info, assert "Item total" is arithmetically correct, finish order and see confirmation |

### API Test Cases — Simple Books API (`https://simple-books-api.click`)
| TC ID | Module | Test Name | Verifications |
|---|---|---|---|
| TC_API_001 | Auth & Orders | Create New Book Order | POST /api-clients/ with a dynamic email returns a Bearer token; POST /orders with a valid bookId returns **201** and a valid `orderId` |
| TC_API_002 | Orders | Fetch Created Order | GET /orders/:orderId returns **200** and a payload matching the bookId + customerName submitted during creation |

> **Note:** TC_API_001 and TC_API_002 share state (the token + `orderId` created
> by TC_API_001) and run in serial mode, so they must be executed together.

## 8. Viewing Reports
After running the suite, an HTML report is generated under `reports/`.
Open it locally with:
```bash
npm run report
```
or directly with
```bash
npx playwright show-report reports/playwright-report
```
Artifacts (screenshots, traces/videos) from failed runs are also captured via
the reporter configuration; API tests record an always-on trace so every
request/response payload is inspectable in the report's trace viewer.

---

### Framework technical highlights
- **Data-driven execution:** TC_UI_002 reads its three scenarios from
  `src/test-data/ui-login.data.json`; API fixtures come from
  `src/test-data/simple-books-api.data.json`.
- **Cross-browser:** configured `projects` for Chromium and Firefox; CI runs both.
- **Window configuration:** `viewport: null` paired with `--start-maximized`,
  so the browser opens fully maximised.
- **Global logging:** `global-setup.ts` / `global-teardown.ts` print
  suite-start/suite-complete markers to the console.
- **Custom utilities:** `src/utils/random-data.ts` generates unique emails,
  strings, and numbers used for dynamic API payloads.
- **Payload visibility:** `src/utils/print.ts` prints each API request/response
  body directly to the console.
- **Locators:** stable `data-test` / `getByTestId` selectors; no hardcoded
  sleeps (Playwright auto-waits everywhere).
- **Yellow flags handled:** SauceDemo marks elements with `data-test`
  (configured via `testIdAttribute`) and its inventory classes are underscored
  (`.inventory_item`, `.shopping_cart_link`).