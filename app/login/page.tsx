import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDict, getLocale } from "@/lib/i18n";
import { signIn, signUp } from "./actions";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; notice?: string }>;
}) {
  const { mode, error, notice } = await searchParams;
  const locale = await getLocale();
  const t = getDict(locale).auth;
  const isSignUp = mode === "signup";

  const errorMessage =
    error === "invalid" ? t.invalid : error === "short" ? t.passwordShort : error ? t.generic : null;

  return (
    <main className="auth">
      <section className="auth-art" aria-hidden="false">
        <p>{t.tagline}</p>
      </section>

      <section className="auth-form">
        <div className="auth-card">
          <LanguageSwitcher current={locale} label={getDict(locale).common.language} />
          <h1>{isSignUp ? t.signUpTitle : t.signInTitle}</h1>

          {notice === "check-email" && <p className="alert info">{t.checkEmail}</p>}
          {errorMessage && (
            <p className="alert" role="alert">
              {errorMessage}
            </p>
          )}

          <form action={isSignUp ? signUp : signIn}>
            <label>
              {t.email}
              <input name="email" type="email" dir="ltr" autoComplete="email" required />
            </label>
            <label>
              {t.password}
              <input
                name="password"
                type="password"
                dir="ltr"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={isSignUp ? 8 : undefined}
                required
              />
            </label>
            <button className="btn" type="submit">
              {isSignUp ? t.signUp : t.signIn}
            </button>
          </form>

          <p className="switch">
            <Link href={isSignUp ? "/login" : "/login?mode=signup"}>
              {isSignUp ? t.toSignIn : t.toSignUp}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
