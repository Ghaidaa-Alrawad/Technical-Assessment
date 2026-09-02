import { test as base } from '@playwright/test';
import { SimpleBooksApiClient } from '../api';

type ApiFixtures = {
  /** Authenticated API client bound to this test's request context. */
  apiClient: SimpleBooksApiClient;
};

/** Test with an injected Simple Books API client fixture. */
export const apiTest = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => use(new SimpleBooksApiClient(request)),
});

export { expect } from '@playwright/test';