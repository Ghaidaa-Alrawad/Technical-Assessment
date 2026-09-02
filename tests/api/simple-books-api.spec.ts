import { expect } from '../../src/fixtures/api.fixtures';
import { apiTest as test } from '../../src/fixtures/api.fixtures';
import apiData from '../../src/test-data/simple-books-api.data.json';
import { randomEmail } from '../../src/utils/random-data';

/**
 * Simple Books API scenarios (test data from external JSON + dynamically
 * generated client email).
 *  - TC_API_001: register a client, then create a new book order.
 *  - TC_API_002: fetch the created order and verify the submitted payload is
 *    reflected accurately.
 */
test.describe('Simple Books API', () => {
  test.describe.configure({ mode: 'serial' });

  // Shared across the serialised tests below (test 002 reads what test 001
  // created) — real tests stay independent and unique per run.
  let accessToken = '';
  let orderId = '';

  test('TC_API_001 - POST /api-clients and POST /orders creates a new book order', async ({
    apiClient,
  }) => {
    // 1. Register a client with a dynamic email to obtain a Bearer token.
    const clientEmail = randomEmail('qa', apiData.apiClient.emailDomain);
    const registered = await apiClient.registerApiClient(
      apiData.apiClient.clientName,
      clientEmail,
    );
    expect(registered.status).toBe(apiData.expectedStatusCodes.created);
    expect(registered.body.accessToken).toBeTruthy();
    accessToken = registered.body.accessToken;

    // 2. Create an order using the token with a valid bookId + customerName.
    const created = await apiClient.createOrder(
      accessToken,
      apiData.newOrder.bookId,
      apiData.newOrder.customerName,
    );
    expect(created.status).toBe(apiData.expectedStatusCodes.created);
    expect(created.body.created).toBe(true);
    expect(created.body.orderId).toBeTruthy();
    orderId = created.body.orderId;
  });

  test('TC_API_002 - GET /orders/:orderId returns the created order', async ({ apiClient }) => {
    // Fetch the order created in TC_API_001.
    const order = await apiClient.getOrder(accessToken, orderId);

    expect(order.status).toBe(apiData.expectedStatusCodes.ok);
    expect(order.body.id).toBe(orderId);
    expect(order.body.bookId).toBe(apiData.newOrder.bookId);
    expect(order.body.customerName).toBe(apiData.newOrder.customerName);
  });
});