import { expect } from '../../src/fixtures/fixtures';
import { test } from '../../src/fixtures/fixtures';
import loginData from '../../src/test-data/ui-login.data.json';

/**
 * TC_UI_003 - End-to-End checkout flow.
 *
 * Flow: valid login -> add the two most expensive products (dynamic) ->
 * cart -> checkout info -> verify the pre-tax "Items total" -> finish ->
 * assert the dispatch confirmation.
 */
test.describe('Checkout', () => {
  const checkoutDetails = {
    firstName: 'Ghaidaa',
    lastName: 'Al Rawad',
    postalCode: '11194',
  };

  test('TC_UI_003 - Complete checkout with the two most expensive products', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Login with valid credentials.
    await test.step('Login with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    });

    // 2. Verify successful navigation to the Products page.
    await test.step('Verify navigation to Products page', async () => {
      await expect(productsPage.title).toHaveText(loginData.validUser.expectedPageTitle);
    });

    // 3. Add the two most expensive products to the cart (dynamic logic).
    let selectedPrices: number[] = [];
    await test.step('Add the two most expensive products to the cart', async () => {
      selectedPrices = await productsPage.addMostExpensiveProducts(2);
      expect(selectedPrices).toHaveLength(2);
      await expect(productsPage.cartBadge).toHaveText('2');
    });

    // 4. Navigate to the cart and proceed to checkout.
    await test.step('Open cart and start checkout', async () => {
      await productsPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    // 5. Fill out the checkout information form and continue.
    await test.step('Fill checkout information', async () => {
      await checkoutPage.fillInformation(checkoutDetails);
    });

    // 6. Verify the pre-tax "Items total" is mathematically correct.
    await test.step('Verify Items total before taxes', async () => {
      const expectedSubtotal = selectedPrices[0] + selectedPrices[1];
      expect(await checkoutPage.getItemsTotal()).toBeCloseTo(expectedSubtotal, 2);
    });

    // 7. Finish and assert the final dispatch confirmation messages.
    await test.step('Finish order and assert dispatch messages', async () => {
      await checkoutPage.finishOrder();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      const dispatchText = await checkoutPage.getCompleteText();
      expect(dispatchText).toContain('dispatched');
    });
  });
});