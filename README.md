# SauceDemo & Simple Books — Playwright Test Automation Framework

Automated testing framework built with **Playwright + TypeScript** using the **Page Object Model** pattern. It covers SauceDemo web UI (login & checkout) and the Simple Books REST API (orders), with data-driven execution from external JSON, cross-browser runs, and HTML reporting.

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | v22.23.2 (tested) — any modern LTS (≥ 20) works |
| npm | 12.0.2 (tested) — npm 10+ works |

## Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Ghaidaa-Alrawad/Technical-Assessment.git
   cd Technical-Assessment
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Install Playwright browsers
   ```bash
   npx playwright install chromium firefox
   ```

## Running Tests

| What | Command |
| --- | --- |
| All tests (UI + API) | `npm test` |
| UI tests only | `npm run test:ui` |
| API tests only | `npm run test:api` |
| Both UI & API (explicit) | `npm run test:all` |
| Headed mode | `npm run test:headed` |

## Architecture Structure

```
playwright-automation/
├── src/
│   ├── pages/            # Page Objects: base, login, products, cart, checkout
│   ├── api/              # Simple Books API client (status, client, orders)
│   ├── utils/            # random-data generator (dynamic emails/strings)
│   ├── test-data/        # external JSON fixtures (UI login + API) — data-driven
│   └── fixtures/         # custom fixtures that inject page/api objects
├── tests/
│   ├── ui/               # UI specs: login.spec.ts, checkout.spec.ts
│   └── api/              # API spec: simple-books-api.spec.ts
├── reports/              # generated HTML report + test artefacts
├── playwright.config.ts  # chromium + firefox + api projects
└── package.json
```

## Test Scenarios

**UI (SauceDemo)** — `https://www.saucedemo.com/`

| TC ID | Module | Test Name |
| --- | --- | --- |
| TC_UI_001 | Login | Valid Login |
| TC_UI_002 | Login | Data-Driven Invalid Login Validation (3 invalid cases) |
| TC_UI_003 | Checkout | End-to-End Checkout Flow (two most expensive products) |

**API (Simple Books)** — `https://simple-books-api.click`

| TC ID | Module | Test Name |
| --- | --- | --- |
| TC_API_001 | Auth & Orders | [POST] Create New Book Order |
| TC_API_002 | Orders | [GET] Fetch Created Order |

## Viewing Reports

After a run, open the generated HTML report:

```bash
npm run report
```

The report is written to `reports/playwright-report/` and can also be opened with `npx playwright show-report`.