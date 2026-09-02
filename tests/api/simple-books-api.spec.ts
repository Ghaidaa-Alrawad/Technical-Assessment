import { expect } from '../../src/fixtures/api.fixtures';
import { apiTest as test } from '../../src/fixtures/api.fixtures';
import apiData from '../../src/test-data/simple-books-api.data.json';
import { randomEmail } from '../../src/utils/random-data';

/**
 * Simple Books API scenarios (test data from external JSON + dynamically
 * generated client email).
 *
 * NOTE — TC_API_001 and TC_API_002 share state (token + orderId) and MUST run
 * together, serially in the same worker. `mode: 'serial'` guarantees this.
 */
test.describe('Simple Books API', () => {
  test.describe.configure({ mode: 'serial' });

  // Shared across the serialised tests below (TC_API_002 reads what
  // TC_API_001 created) — each run gets a fresh, unique client + order.
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

    expect(registered.status, 'client registration should be 201 Created').toBe(
      apiData.expectedStatusCodes.created,
    );
    expect(registered.headers['content-type']).toContain('application/json');
    expect(registered.body.accessToken).toBeTruthy();
    expect(registered.body.accessToken).toEqual(expect.any(String));
    accessToken = registered.body.accessToken;

    // 2. Create an order using the token with a valid bookId + customerName.
    const created = await apiClient.createOrder(
      accessToken,
      apiData.newOrder.bookId,
      apiData.newOrder.customerName,
    );

    expect(created.status, 'order creation should be 201 Created').toBe(
      apiData.expectedStatusCodes.created,
    );
    expect(created.headers['content-type']).toContain('application/json');
    expect(created.body.created).toBe(true);
    expect(created.body.orderId).toBeTruthy();
    expect(created.body.orderId).toEqual(expect.any(String));
    orderId = created.body.orderId;
  });

  test('TC_API_002 - GET /orders/:orderId returns the created order', async ({ apiClient }) => {
    // Fetch the order created in TC_API_001.
    const order = await apiClient.getOrder(accessToken, orderId);

    expect(order.status, 'fetching the order should be 200 OK').toBe(
      apiData.expectedStatusCodes.ok,
    );
    expect(order.headers['content-type']).toContain('application/json');
    // The retrieved payload must reflect exactly what was submitted.
    expect(order.body.id).toBe(orderId);
    expect(order.body.bookId).toBe(apiData.newOrder.bookId);
    expect(order.body.customerName).toBe(apiData.newOrder.customerName);
    expect(order.body.quantity).toBe(1);
    expect(order.body.timestamp).toEqual(expect.any(Number));
  });
});