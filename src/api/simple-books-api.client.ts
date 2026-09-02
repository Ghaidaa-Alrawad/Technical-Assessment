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

/** Standard happy-path shape returned by every client method. */
export interface ApiResponse<T> {
  status: number;
  /** Lower-cased response headers (Node fetch normalises header names). */
  headers: Record<string, string>;
  body: T;
}

/**
 * Thin wrapper around Playwright's APIRequestContext for the Simple Books API
 * (https://simple-books-api.click). Every call returns the HTTP status, the
 * response headers and the parsed body so tests can assert the full picture.
 */
export class SimpleBooksApiClient {
  readonly baseUrl: string = apiData.baseUrl;

  constructor(private readonly request: APIRequestContext) {}

  /** GET /status — API health check. */
  async getStatus(): Promise<ApiResponse<{ status: string }>> {
    return this.send(() => this.request.get(`${this.baseUrl}/status`));
  }

  /** POST /api-clients — register a client and receive a Bearer access token. */
  async registerApiClient(
    clientName: string,
    clientEmail: string,
  ): Promise<ApiResponse<ClientRegistration>> {
    return this.send(() =>
      this.request.post(`${this.baseUrl}/api-clients`, {
        data: { clientName, clientEmail },
      }),
    );
  }

  /** POST /orders — create a new book order for the authenticated client. */
  async createOrder(
    accessToken: string,
    bookId: number,
    customerName: string,
  ): Promise<ApiResponse<CreatedOrder>> {
    return this.send(() =>
      this.request.post(`${this.baseUrl}/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { bookId, customerName },
      }),
    );
  }

  /** GET /orders/:orderId — fetch a previously created order. */
  async getOrder(
    accessToken: string,
    orderId: string,
  ): Promise<ApiResponse<OrderDetails>> {
    return this.send(() =>
      this.request.get(`${this.baseUrl}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
  }

  /** Execute a request and normalise {status, headers, body}. */
  private async send<T>(
    call: () => Promise<import('@playwright/test').APIResponse>,
  ): Promise<ApiResponse<T>> {
    const response = await call();
    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
    };
  }
}