import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/** Shape of the customer details required on the checkout information step. */
export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Page Object for the SauceDemo checkout journey.
 * Covers both the checkout information form (step one) and the order
 * overview/confirmation steps (step two + complete).
 */
export class CheckoutPage extends BasePage {
  // Step one: information form.
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  // Step two: order overview.
  readonly summaryItems: Locator;
  readonly subtotalValue: Locator;
  readonly finishButton: Locator;

  // Final confirmation.
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    this.summaryItems = page.locator('.cart_item');
    this.subtotalValue = page.getByTestId('subtotal-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
  }

  /** Fill the checkout information form and continue. */
  async fillInformation(details: CheckoutDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.postalCodeInput.fill(details.postalCode);
    await this.continueButton.click();
  }

  /** "Item total" shown on the overview, parsed to a number. */
  async getItemsTotal(): Promise<number> {
    const text = (await this.subtotalValue.textContent()) ?? '$0';
    return parseFloat(text.replace(/\D/g, ''));
  }

  /** Click Finish to place the order. */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /** Confirmation heading, e.g. "Thank you for your order!". */
  async getCompleteHeader(): Promise<string> {
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }

  /** The dispatch confirmation message. */
  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent())?.trim() ?? '';
  }
}