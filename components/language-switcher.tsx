import { setLocale } from "@/app/actions";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  return (
    <form action={setLocale} className="lang" aria-label={label}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="submit"
          name="locale"
          value={code}
          aria-current={code === current}
          lang={LOCALE_META[code].htmlLang}
        >
          {LOCALE_META[code].label}
        </button>
      ))}
    </form>
  );
}
