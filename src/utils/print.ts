/**
 * Prints a request/response payload to the console so the data is visible
 * directly in the test output (not buried inside the trace viewer).
 */
export function printPayload(label: string, data: unknown): void {
  const rule = '='.repeat(60);
  console.log(`\n${rule}`);
  console.log(label);
  console.log(rule);
  console.log(JSON.stringify(data, null, 2));
}