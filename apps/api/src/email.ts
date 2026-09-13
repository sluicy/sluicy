/** Good enough for a form field: something@something.tld. The mail transport is the real validator. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}
