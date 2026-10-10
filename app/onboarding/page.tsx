import { redirect } from "next/navigation";
import { createWorkspace } from "@/app/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDict, getLocale } from "@/lib/i18n";
import { getSession } from "@/lib/workspace";

export const metadata = { title: "Espace de travail" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, user } = await getSession();
  if (!user) redirect("/login");

  // Someone who already has a workspace has nothing to set up.
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing) redirect("/");

  const locale = await getLocale();
  const dict = getDict(locale);
  const t = dict.onboarding;

  return (
    <main className="auth">
      <section className="auth-art">
        <p>{dict.auth.tagline}</p>
      </section>

      <section className="auth-form">
        <div className="auth-card">
          <LanguageSwitcher current={locale} label={dict.common.language} />
          <h1>{t.title}</h1>
          <p className="muted">{t.help}</p>

          {error && (
            <p className="alert" role="alert">
              {t.error}
            </p>
          )}

          <form action={createWorkspace}>
            <label>
              {t.companyName}
              <input name="name" type="text" minLength={2} maxLength={80} autoComplete="organization" required />
            </label>
            <button className="btn" type="submit">
              {t.submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
