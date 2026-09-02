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
 */
type PageObjects = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';