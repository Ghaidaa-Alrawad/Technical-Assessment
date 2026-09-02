import type { FullConfig } from '@playwright/test';

/**
 * Runs once, immediately before the whole test suite begins.
 * Prints global logging markers so the lifecycle of a full run is visible
 * in the console output.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const projects = config.projects.map((p) => p.name).join(', ');
  console.log('');
  console.log('============================================================');
  console.log('[GLOBAL SETUP] Test suite has started.');
  console.log(`[GLOBAL SETUP] Executing projects: ${projects}`);
  console.log('============================================================');
  console.log('');
}

export default globalSetup;