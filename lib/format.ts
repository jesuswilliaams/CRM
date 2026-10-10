import { LOCALE_META, type Locale } from "@/lib/i18n";

export function formatMoney(amount: number, currency: string, locale: Locale) {
  try {
    return new Intl.NumberFormat(LOCALE_META[locale].intl, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function daysSince(iso: string, now = Date.now()) {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / 86_400_000));
}

export function formatDateTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** Lowercase, strip diacritics: matches how the database builds contacts.search_text. */
export function normalizeSearch(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
