import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the SauceDemo inventory ("Products") page.
 * Also hosts the dynamic price-sorting helpers used by the E2E checkout flow
 * to identify and add the most expensive products to the cart.
 */
export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;
  readonly shoppingCartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('.inventory_item button.btn_inventory');
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /** Displayed page heading, e.g. "Products". */
  async getTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  /** Read every product price, parsed to a number. */
  async getPrices(): Promise<number[]> {
    const raw = await this.page.locator('.inventory_item_price').allTextContents();
    return raw.map((text) => parseFloat((text ?? '').replace('$', '').trim()));
  }

  /** Number of items currently in the cart (0 when the badge is hidden). */
  async getCartItemCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return parseInt((await this.cartBadge.textContent()) ?? '0', 10);
  }

  /** Add the inventory item at `index` (0-based) to the cart. */
  async addProductToCartByIndex(index: number): Promise<void> {
    await this.inventoryItems.nth(index).locator('button.btn_inventory').click();
  }

  /**
   * Add the `count` most expensive products to the cart.
   * Prices are read live from the page each call, so the logic stays correct
   * regardless of the current default sort order.
   */
  async addMostExpensiveProducts(count: number): Promise<number[]> {
    const prices = await this.getPrices();
    // Indices ordered by price, highest first, ties broken by index.
    const topIndices = prices
      .map((price, index) => ({ price, index }))
      .sort((a, b) => b.price - a.price || a.index - b.index)
      .slice(0, count)
      .map((entry) => entry.index);

    for (const index of topIndices) {
      await this.addProductToCartByIndex(index);
    }
    // Return the chosen prices so tests can assert the running total.
    return topIndices.map((index) => prices[index]);
  }

  /** Open the shopping cart. */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}