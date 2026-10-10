import { createDeal, moveDeal } from "@/app/actions";
import { AutoSubmitSelect } from "@/components/auto-submit-select";
import { daysSince, formatMoney } from "@/lib/format";
import { getDict, getLocale } from "@/lib/i18n";
import type { Deal, Stage } from "@/lib/types";
import { requireWorkspace } from "@/lib/workspace";

export const metadata = { title: "Pipeline" };

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, workspace } = await requireWorkspace();
  const locale = await getLocale();
  const dict = getDict(locale);
  const t = dict.pipeline;

  const [stagesRes, dealsRes, contactsRes] = await Promise.all([
    supabase
      .from("pipeline_stages")
      .select("id, name, position, is_won, is_lost")
      .eq("workspace_id", workspace.id)
      .order("position", { ascending: true }),
    supabase
      .from("deals")
      .select("id, title, amount, currency, stage_id, status, contact_id, last_activity_at, contacts(full_name)")
      .eq("workspace_id", workspace.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("contacts")
      .select("id, full_name")
      .eq("workspace_id", workspace.id)
      .order("full_name", { ascending: true })
      .limit(300),
  ]);

  const stages = (stagesRes.data ?? []) as Stage[];
  const deals = (dealsRes.data ?? []) as unknown as Deal[];
  const contacts = (contactsRes.data ?? []) as { id: string; full_name: string }[];
  const firstStageId = stages[0]?.id ?? "";

  const errorMessage = error === "move" ? t.moveError : error ? t.createError : null;

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
        <summary className="btn small">{t.newDeal}</summary>
        <form action={createDeal} className="form-grid cols">
          <label>
            {t.dealTitle}
            <input name="title" type="text" maxLength={120} required />
          </label>
          <label>
            {`${t.amount} (${workspace.default_currency})`}
            <input name="amount" type="number" inputMode="decimal" min="0" step="0.01" defaultValue="0" dir="ltr" />
          </label>
          <label>
            {t.contact}
            <select name="contact_id" defaultValue="">
              <option value="">{t.noContact}</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.stage}
            <select name="stage_id" defaultValue={firstStageId}>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <button className="btn" type="submit">
              {dict.common.add}
            </button>
          </div>
        </form>
      </details>

      <div className="board">
        {stages.map((stage) => {
          const inStage = deals.filter((d) => d.stage_id === stage.id);
          return (
            <section className="column" key={stage.id} aria-label={stage.name}>
              <div className="column-head">
                <span>{stage.name}</span>
                <span className="muted">{inStage.length}</span>
              </div>

              {inStage.length === 0 && <p className="hint">{t.empty}</p>}

              {inStage.map((deal) => (
                <article className="card" key={deal.id}>
                  <strong>{deal.title}</strong>
                  <span className="amount">{formatMoney(Number(deal.amount), deal.currency, locale)}</span>
                  <span className="hint">
                    {deal.contacts?.full_name ?? t.noContact}
                    {deal.status === "open" && daysSince(deal.last_activity_at) >= workspace.followup_days && (
                      <>
                        {" "}
                        <span className="badge">
                          {daysSince(deal.last_activity_at)} {dict.dashboard.daysShort}
                        </span>
                      </>
                    )}
                  </span>
                  <form action={moveDeal}>
                    <input type="hidden" name="deal_id" value={deal.id} />
                    <AutoSubmitSelect name="stage_id" defaultValue={deal.stage_id} label={t.moveTo}>
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </AutoSubmitSelect>
                  </form>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
