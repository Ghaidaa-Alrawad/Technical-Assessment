import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the SauceDemo shopping cart.
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  /** Number of distinct products currently in the cart. */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Proceed to the checkout information step. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}