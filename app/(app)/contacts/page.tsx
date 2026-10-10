import { createContact } from "@/app/actions";
import { normalizeSearch } from "@/lib/format";
import { getDict, getLocale } from "@/lib/i18n";
import type { Contact } from "@/lib/types";
import { requireWorkspace } from "@/lib/workspace";

export const metadata = { title: "Contacts" };

function searchPattern(raw: string) {
  let q = normalizeSearch(raw);
  // A local number typed as 06 12 34... is stored as +212612...: search the part after the leading 0.
  const compact = q.replace(/[\s+]/g, "");
  if (/^0\d+$/.test(compact)) q = compact.slice(1);
  else if (/^\d+$/.test(compact)) q = compact;
  return `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string }>;
}) {
  const { q = "", error } = await searchParams;
  const { supabase, workspace } = await requireWorkspace();
  const locale = await getLocale();
  const dict = getDict(locale);
  const t = dict.contacts;

  let query = supabase
    .from("contacts")
    .select("id, full_name, phone_e164, email, name_aliases, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const term = q.trim();
  if (term) query = query.ilike("search_text", searchPattern(term));

  const { data } = await query;
  const contacts = (data ?? []) as Contact[];

  const errorMessage = error === "phone" ? t.invalidPhone : error ? t.createError : null;

  return (
    <div className="stack">
      <div className="page-head">
        <h1>{t.title}</h1>
      </div>

      {errorMessage && (
        <p className="alert" role="alert">
          {errorMessage}
        </p>
      )}

      <details className="panel form-panel">
        <summary className="btn small">{t.newContact}</summary>
        <form action={createContact} className="form-grid cols">
          <label>
            {t.fullName}
            <input name="full_name" type="text" maxLength={120} autoComplete="off" required />
          </label>
          <label>
            {t.alias}
            <input name="alias" type="text" maxLength={120} autoComplete="off" />
            <span className="hint">{t.aliasHelp}</span>
          </label>
          <label>
            {t.phone}
            <input name="phone" type="tel" dir="ltr" autoComplete="off" />
            <span className="hint">{t.phoneHelp}</span>
          </label>
          <label>
            {t.email}
            <input name="email" type="email" dir="ltr" autoComplete="off" />
          </label>
          <div>
            <button className="btn" type="submit">
              {dict.common.add}
            </button>
          </div>
        </form>
      </details>

      <form className="search" role="search">
        <input
          name="q"
          type="search"
          defaultValue={term}
          placeholder={t.searchPlaceholder}
          aria-label={dict.common.search}
        />
        <button className="btn quiet" type="submit">
          {dict.common.search}
        </button>
      </form>

      <section className="panel">
        {contacts.length === 0 ? (
          <p className="empty">{term ? t.noResults : t.empty}</p>
        ) : (
          contacts.map((c) => (
            <div className="row" key={c.id}>
              <div className="grow">
                <div className="title">{c.full_name}</div>
                {c.name_aliases.length > 0 && <div className="hint">{c.name_aliases.join(" · ")}</div>}
              </div>
              <div className="ltr muted">{c.phone_e164 ?? c.email ?? dict.common.none}</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
