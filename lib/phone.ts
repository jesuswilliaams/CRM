/**
 * Turns user input into E.164 (the format the database enforces).
 * "06 12 34 56 78" becomes "+212612345678"; "0033 6 12 34 56 78" becomes "+33612345678".
 * Returns null when the input cannot be a valid number.
 */
export function normalizePhone(input: string): string | null {
  let s = input.trim().replace(/[\s().-]/g, "");
  if (!s) return null;
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  else if (/^0\d{9}$/.test(s)) s = `+212${s.slice(1)}`;
  return /^\+[1-9]\d{6,14}$/.test(s) ? s : null;
}
