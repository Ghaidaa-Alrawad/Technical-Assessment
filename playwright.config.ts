import { defineConfig } from '@playwright/test';
import apiData from './src/test-data/simple-books-api.data.json';

// Desktop device presets set a fixed viewport + deviceScaleFactor, which is
// incompatible with our maximised-window requirement (viewport: null). We
// therefore define projects explicitly and pair viewport:null with a
// launch flag so the browser window opens fully maximised.
const maximizeChromium = { args: ['--start-maximized'] };
const maximizeFirefox = { args: ['--start-maximized'] };

// The Simple Books API test file is a pure API suite: it must run exactly once
// (not once per browser). Give it its own project and exclude it from the UI
// browser projects.
const APIS = '**/api/**';

/**
 * Playwright configuration for the Technical Assessment framework.
 *
 * Requirements covered here:
 *  - Cross-browser: runs on both Chromium (Google Chrome) and Firefox.
 *  - Maximised window: `viewport: null` + `--start-maximized` lets the browser
 *    launch in its fully-maximised window rather than a fixed size.
 *  - Reports: HTML report written under `reports/playwright-report` and a
 *    console `list` reporter for easy CI/log reading.
 *  - Global setup/teardown logging: wired to ./global-setup.ts and
 *    ./global-teardown.ts which print suite start/end markers to the console.
 */
export default defineConfig({
  // Root folder that owns all test spec files.
  testDir: './tests',
  // Nest every runtime artifact (screenshots/videos/traces/HTML) under reports/.
  outputDir: './reports/test-results',

  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,

  // Retries only on CI; locally failures should be immediate and visible.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],

  // Global hooks that bracket the entire test suite (see files in repo root).
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo marks its elements with data-test (not data-testid).
    testIdAttribute: 'data-test',
    // null + --start-maximized => browser owns its window size (maximised).
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
        {
          name: 'chromium',
          testIgnore: APIS,
          use: {
            browserName: 'chromium',
            viewport: null,
            launchOptions: maximizeChromium,
          },
        },
        {
          name: 'firefox',
          testIgnore: APIS,
          use: {
            browserName: 'firefox',
            viewport: null,
            launchOptions: maximizeFirefox,
          },
        },
        {
                name: 'api',
                testMatch: APIS,
                use: {
                  baseURL: apiData.baseUrl,
                  // Always record a trace for API tests so every HTTP request/response
                  // payload is inspectable in the HTML report / trace viewer.
                  trace: 'on',
                  screenshot: 'off',
                  video: 'off',
                },
              },
      ],
});