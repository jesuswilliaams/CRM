import Link from "next/link";
import { daysSince, formatMoney } from "@/lib/format";
import { format, getDict, getLocale } from "@/lib/i18n";
import type { OverdueDeal, StageSummary } from "@/lib/types";
import { requireWorkspace } from "@/lib/workspace";

export const metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const { supabase, workspace } = await requireWorkspace();
  const locale = await getLocale();
  const t = getDict(locale).dashboard;

  const [summaryRes, overdueRes] = await Promise.all([
    supabase
      .from("deal_pipeline_summary")
      .select("stage_id, stage_name, position, deals_count, total_amount")
      .eq("workspace_id", workspace.id)
      .order("position", { ascending: true }),
    supabase
      .from("overdue_deals")
      .select("id, title, amount, currency, last_activity_at")
      .eq("workspace_id", workspace.id)
      .order("last_activity_at", { ascending: true })
      .limit(10),
  ]);

  const stages = ((summaryRes.data ?? []) as StageSummary[]).map((s) => ({
    ...s,
    deals_count: Number(s.deals_count ?? 0),
    total_amount: Number(s.total_amount ?? 0),
  }));
  const overdue = (overdueRes.data ?? []) as OverdueDeal[];

  const openDeals = stages.reduce((sum, s) => sum + s.deals_count, 0);
  const openAmount = stages.reduce((sum, s) => sum + s.total_amount, 0);
  const maxAmount = Math.max(1, ...stages.map((s) => s.total_amount));

  return (
    <div className="stack">
      <div className="page-head">
        <h1>{t.title}</h1>
      </div>

      <div className="kpis">
        <div className="panel kpi">
          <span className="muted">{t.forecast}</span>
          <strong>{formatMoney(openAmount, workspace.default_currency, locale)}</strong>
        </div>
        <div className="panel kpi">
          <span className="muted">{t.deals}</span>
          <strong>{openDeals}</strong>
        </div>
        <div className="panel kpi">
          <span className="muted">{t.overdue}</span>
          <strong>{overdue.length}</strong>
        </div>
      </div>

      <div className="two-col">
        <section className="panel stack" aria-labelledby="by-stage">
          <h2 id="by-stage">{t.byStage}</h2>
          {openDeals === 0 ? (
            <p className="empty">
              {t.noDeals} <Link href="/pipeline">{getDict(locale).nav.pipeline}</Link>
            </p>
          ) : (
            <div className="bars">
              {stages.map((s) => (
                <div key={s.stage_id}>
                  <div className="bar-head">
                    <span>
                      {s.stage_name} · {s.deals_count}
                    </span>
                    <span>{formatMoney(s.total_amount, workspace.default_currency, locale)}</span>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <div className="bar-fill" style={{ width: `${(s.total_amount / maxAmount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="overdue">
          <h2 id="overdue">{t.overdue}</h2>
          <p className="hint">{format(t.overdueHelp, { days: workspace.followup_days })}</p>
          {overdue.length === 0 ? (
            <p className="empty">{t.overdueEmpty}</p>
          ) : (
            <div>
              {overdue.map((d) => (
                <div className="row" key={d.id}>
                  <div className="grow">
                    <div className="title">{d.title}</div>
                    <div className="hint">{formatMoney(Number(d.amount), d.currency, locale)}</div>
                  </div>
                  <span className="badge">
                    {daysSince(d.last_activity_at)} {t.daysShort}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
