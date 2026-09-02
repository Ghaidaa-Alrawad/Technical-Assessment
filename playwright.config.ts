import { defineConfig } from '@playwright/test';
import apiData from './src/test-data/simple-books-api.data.json';

// Maximise the browser window. Desktop device presets set a fixed viewport +
// deviceScaleFactor which conflicts with a full-screen window, so projects are
// defined explicitly:
//  - Chromium honours `--start-maximized` with `viewport: null`.
//  - Firefox ignores both `--start-maximized` and JS `window.resizeTo`, so it
//    is instead sized to the full screen via a real viewport (the window
//    follows the viewport); the _maximisedPage fixture fine-tunes it to the
//    actual screen resolution at runtime.
const maximizeChromium = { args: ['--start-maximized'] };
const maximizeFirefox = {};
const FULL_SCREEN = { width: 1920, height: 1152 };

// The Simple Books API test file is a pure API suite: it must run exactly once
// (not once per browser). Give it its own project and exclude it from the UI
// browser projects.
const APIS = '**/api/**';

/**
 * Playwright configuration for the Technical Assessment framework.
 *
 * Requirements covered here:
 *  - Cross-browser: runs on both Chromium (Google Chrome) and Firefox.
 *  - Maximised window: Chromium via `viewport:null` + `--start-maximized`;
 *    Firefox via a full-screen viewport (see top-of-file comment).
 *  - Reports: HTML report written under `reports/playwright-report` plus a
 *    console `list` reporter for easy CI/log reading.
 *  - Global setup/teardown logging: wired to ./global-setup.ts and
 *    ./global-teardown.ts which print suite start/end markers to the console.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './reports/test-results',

  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo marks its elements with data-test (not data-testid).
    testIdAttribute: 'data-test',
    viewport: null, // Chromium: let --start-maximized own the window size.
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
        viewport: FULL_SCREEN,
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