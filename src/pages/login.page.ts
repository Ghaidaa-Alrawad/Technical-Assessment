import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the SauceDemo login screen.
 * URL: https://www.saucedemo.com/
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Set the username and password fields. */
  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /** Perform a full login attempt (fills fields, then submits). */
  async login(username: string, password: string): Promise<void> {
    await this.enterCredentials(username, password);
    await this.loginButton.click();
  }

  /** The visible validation error text (empty if none is shown). */
  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}