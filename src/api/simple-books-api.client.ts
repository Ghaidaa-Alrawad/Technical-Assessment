import type { APIRequestContext } from '@playwright/test';
import apiData from '../test-data/simple-books-api.data.json';

/** Response body of a successful client registration. */
export interface ClientRegistration {
  accessToken: string;
}

/** Response body of a successful order creation. */
export interface CreatedOrder {
  created: boolean;
  orderId: string;
}

/** Response body of a fetched order. */
export interface OrderDetails {
  id: string;
  bookId: number;
  customerName: string;
  quantity: number;
  timestamp: number;
}

/**
 * Thin wrapper around Playwright's APIRequestContext for the Simple Books API
 * (https://simple-books-api.click). Returns both the HTTP status and parsed
 * body so tests can assert status codes and payloads together.
 */
export class SimpleBooksApiClient {
  readonly baseUrl: string = apiData.baseUrl;

  constructor(private readonly request: APIRequestContext) {}

  /** GET /status — API health check. */
  async getStatus(): Promise<{ status: number; body: { status: string } }> {
    const response = await this.request.get(`${this.baseUrl}/status`);
    return { status: response.status(), body: await response.json() };
  }

  /** POST /api-clients — register a client and receive a Bearer access token. */
  async registerApiClient(
    clientName: string,
    clientEmail: string,
  ): Promise<{ status: number; body: ClientRegistration }> {
    const response = await this.request.post(`${this.baseUrl}/api-clients`, {
      data: { clientName, clientEmail },
    });
    return { status: response.status(), body: await response.json() };
  }

  /** POST /orders — create a new book order for the authenticated client. */
  async createOrder(
    accessToken: string,
    bookId: number,
    customerName: string,
  ): Promise<{ status: number; body: CreatedOrder }> {
    const response = await this.request.post(`${this.baseUrl}/orders`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { bookId, customerName },
    });
    return { status: response.status(), body: await response.json() };
  }

  /** GET /orders/:orderId — fetch a previously created order. */
  async getOrder(
    accessToken: string,
    orderId: string,
  ): Promise<{ status: number; body: OrderDetails }> {
    const response = await this.request.get(`${this.baseUrl}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { status: response.status(), body: await response.json() };
  }
}