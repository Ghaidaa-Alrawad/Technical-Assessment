/**
 * Custom utility to generate random, dynamic values.
 * Used to build unique API payloads (client emails, etc.) and unique UI inputs
 * without hard-coding literals in tests.
 */

const DEFAULT_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

/** Random alphanumeric string of `length` chars, optionally prefixed. */
export function randomString(length = 8, prefix = ''): string {
  let value = prefix;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * DEFAULT_CHARS.length);
    value += DEFAULT_CHARS[randomIndex];
  }
  return value;
}

/** Random integer between `min` and `max` (inclusive). */
export function randomNumber(min = 1, max = 1_000_000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random, unique email address.
 * `prefix` is kept human-readable; a timestamp + random suffix guarantee
 * uniqueness across runs (the Simple Books API rejects duplicate client emails).
 */
export function randomEmail(prefix: string, domain: string): string {
  return `${prefix}.${Date.now()}.${randomString(4)}${domain}`;
}