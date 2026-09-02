import { expect } from '../../src/fixtures/fixtures';
import { test } from '../../src/fixtures/fixtures';
import loginData from '../../src/test-data/ui-login.data.json';

/**
 * SauceDemo login scenarios.
 *  - TC_UI_001 : valid login navigates to the Products page.
 *  - TC_UI_002 : data-driven invalid login validations (read from JSON).
 */
test.describe('Login', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC_UI_001 - Valid login succeeds and navigates to Products page', async ({
    loginPage,
    productsPage,
  }) => {
    await test.step('Navigate to SauceDemo login page', async () => {
      await loginPage.goto();
    });

    await test.step('Log in with valid credentials', async () => {
      await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    });

    await test.step('Assert navigation to the Products page', async () => {
      await expect(productsPage.title).toHaveText(loginData.validUser.expectedPageTitle);
      await expect(productsPage.inventoryItems.first()).toBeVisible();
    });
  });

  for (const scenario of loginData.invalidLoginScenarios) {
    test(`TC_UI_002 - Invalid login (${scenario.name}) shows a validation error`, async ({
      loginPage,
    }) => {
      await test.step('Navigate to SauceDemo login page', async () => {
        await loginPage.goto();
      });

      await test.step('Attempt login and submit', async () => {
        await loginPage.login(scenario.username, scenario.password);
      });

      await test.step('Assert the validation error message is displayed', async () => {
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(scenario.expectedError);
      });
    });
  }
});