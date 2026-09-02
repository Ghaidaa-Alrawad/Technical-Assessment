import { test as base, Page } from '@playwright/test';
import {
  CartPage,
  CheckoutPage,
  LoginPage,
  ProductsPage,
} from '../pages';

/**
 * Custom Playwright fixtures that instantiate the Page Objects once per test
 * and inject them automatically — tests never manually `new` a page object.
 *
 * Two lifecycle concerns handled here:
 *  - _maximisedPage : guarantees the browser window opens fully maximised.
 *    Chromium is maximised via `viewport:null` + `--start-maximized`; Firefox
 *    ignores those, so its window is sized to the real screen resolution here.
 *  - _closeAfterSuite : explicitly closes the browser once the worker's last
 *    test has finished.
 */
type TestFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** The page (per test) whose window has been forced full-screen. */
  _maximisedPage: Page;
};

type WorkerFixtures = {
  /** Closes the browser after the last test in the worker. */
  _closeAfterSuite: void;
};

/** Detect the available screen area and size the window/viewport to fill it. */
async function maximiseWindow(page: Page): Promise<void> {
  try {
    const screen = await page.evaluate(() => {
      const win = globalThis as unknown as {
        screen?: { availWidth: number; availHeight: number };
      };
      return {
        width: win.screen?.availWidth ?? 0,
        height: win.screen?.availHeight ?? 0,
      };
    });
    if (screen.width && screen.height) {
      // Works when a viewport is set (Firefox). Chromium uses viewport:null +
      // --start-maximized already, so setViewportSize throws here -> caught.
      await page.setViewportSize({ width: screen.width, height: screen.height });
      console.log(`[WINDOW] maximised -> ${screen.width}x${screen.height}`);
    }
  } catch (error) {
    console.log(`[WINDOW] maximised via launch flags/skip (${(error as Error).message})`);
  }
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  _closeAfterSuite: [
    async ({ browser }, use) => {
      await use(); // runs all tests in this worker first
      console.log('[WINDOW] closing browser after last test finishes');
      try {
        await browser.close();
        console.log(`[WINDOW] browser closed (isConnected=${browser.isConnected()})`);
      } catch (error) {
        console.log(`[WINDOW] browser close threw (${(error as Error).message})`);
      }
    },
    { scope: 'worker' },
  ],

  _maximisedPage: [
    async ({ page }, use) => {
      await maximiseWindow(page);
      await use(page);
    },
    { scope: 'test' },
  ],

  loginPage: async ({ _maximisedPage, _closeAfterSuite }, use) =>
    use(new LoginPage(_maximisedPage)),
  productsPage: async ({ _maximisedPage, _closeAfterSuite }, use) =>
    use(new ProductsPage(_maximisedPage)),
  cartPage: async ({ _maximisedPage, _closeAfterSuite }, use) =>
    use(new CartPage(_maximisedPage)),
  checkoutPage: async ({ _maximisedPage, _closeAfterSuite }, use) =>
    use(new CheckoutPage(_maximisedPage)),
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';