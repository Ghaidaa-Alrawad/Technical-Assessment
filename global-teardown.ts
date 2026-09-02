/**
 * Runs once, immediately after the whole test suite has finished.
 * Prints a global logging marker so the end of a full run is visible
 * in the console output.
 */
async function globalTeardown(): Promise<void> {
  console.log('');
  console.log('============================================================');
  console.log('[GLOBAL TEARDOWN] Test suite has finished.');
  console.log('============================================================');
  console.log('');
}

export default globalTeardown;