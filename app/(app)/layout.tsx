import { signOut } from "@/app/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLinks, type NavItem } from "@/components/nav-links";
import { getDict, getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { workspace } = await requireWorkspace();
  const locale = await getLocale();
  const dict = getDict(locale);

  const items: NavItem[] = [
    { href: "/", label: dict.nav.dashboard },
    { href: "/pipeline", label: dict.nav.pipeline },
    { href: "/contacts", label: dict.nav.contacts },
    { href: "/inbox", label: dict.nav.inbox },
  ];

  return (
    <div className="shell">
      <nav className="rail" aria-label="Navigation">
        <NavLinks items={items} />
      </nav>

      <header className="topbar">
        <span className="workspace">{workspace.name}</span>
        <div className="tools">
          <LanguageSwitcher current={locale} label={dict.common.language} />
          <form action={signOut}>
            <button className="btn quiet small" type="submit">
              {dict.common.signOut}
            </button>
          </form>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="tabbar" aria-label="Navigation">
        <NavLinks items={items} />
      </nav>
    </div>
  );
}
