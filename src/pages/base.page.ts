import type { Page } from '@playwright/test';

/**
 * Shared base for every Page Object.
 * Holds the Playwright page instance so all page objects stay DRY and receive
 * the same `page` reference (injected via the custom fixtures).
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}