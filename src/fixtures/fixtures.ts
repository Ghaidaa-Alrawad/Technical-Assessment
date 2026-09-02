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
 * Two lifecycle concerns are handled here too:
 *  - _maximisedPage : guarantees the browser window opens fully maximised
 *    (belt-and-braces on top of `viewport:null` + `--start-maximized`).
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

/** Force the browser window to fill the available screen (headed mode). */
async function maximiseWindow(page: Page): Promise<void> {
  try {
    const size = await page.evaluate(() => {
      const win = globalThis as unknown as {
        moveTo: (x: number, y: number) => void;
        resizeTo: (w: number, h: number) => void;
        screen?: { availWidth: number; availHeight: number };
      };
      if (win.screen) {
        win.moveTo(0, 0);
        win.resizeTo(win.screen.availWidth, win.screen.availHeight);
        return { width: win.screen.availWidth, height: win.screen.availHeight };
      }
      return { width: 0, height: 0 };
    });
    console.log(`[WINDOW] maximised -> ${size.width}x${size.height}`);
  } catch (error) {
    console.log(`[WINDOW] maximise skipped (${(error as Error).message})`);
  }
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  _closeAfterSuite: [
    async ({ browser }, use) => {
      await use(); // runs all tests in this worker first
      console.log('[WINDOW] closing browser after last test finishes');
      try {
        await browser.close();
      } catch {
        console.log('[WINDOW] browser was already closed');
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