import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { getDict, getLocale } from "@/lib/i18n";
import type { Conversation, Message } from "@/lib/types";
import { requireWorkspace } from "@/lib/workspace";

export const metadata = { title: "Messages" };

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c: selectedId } = await searchParams;
  const { supabase, workspace } = await requireWorkspace();
  const locale = await getLocale();
  const t = getDict(locale).inbox;

  const { data } = await supabase
    .from("conversations")
    .select("id, last_message_at, status, contacts(full_name, phone_e164)")
    .eq("workspace_id", workspace.id)
    .order("last_message_at", { ascending: false })
    .limit(100);
  const conversations = (data ?? []) as unknown as Conversation[];

  const selected = conversations.find((conv) => conv.id === selectedId) ?? null;

  let messages: Message[] = [];
  if (selected) {
    const { data: rows } = await supabase
      .from("messages")
      .select("id, direction, body, sent_at")
      .eq("conversation_id", selected.id)
      .order("sent_at", { ascending: true })
      .limit(200);
    messages = (rows ?? []) as Message[];
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1>{t.title}</h1>
      </div>

      {conversations.length === 0 ? (
        <p className="panel empty">{t.empty}</p>
      ) : (
        <div className="inbox">
          <section className="panel list-pane" data-hidden={selected ? "true" : "false"} aria-label={t.title}>
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/inbox?c=${conv.id}`}
                className="convo"
                aria-current={conv.id === selected?.id}
              >
                <div className="row" style={{ padding: 0, border: 0 }}>
                  <strong className="title">{conv.contacts?.full_name ?? "—"}</strong>
                  <span className="badge wa">WhatsApp</span>
                </div>
                <div className="hint">{formatDateTime(conv.last_message_at, locale)}</div>
              </Link>
            ))}
          </section>

          <section className="panel thread-pane" data-hidden={selected ? "false" : "true"}>
            {selected ? (
              <>
                <Link className="back-link" href="/inbox">
                  {t.back}
                </Link>
                <h2>{selected.contacts?.full_name}</h2>
                <p className="hint ltr">{selected.contacts?.phone_e164}</p>

                <div className="bubbles">
                  {messages.length === 0 && <p className="muted">{t.noMessages}</p>}
                  {messages.map((m) => (
                    <div key={m.id} className={`bubble ${m.direction === "inbound" ? "in" : "out"}`}>
                      {m.body}
                      <time dateTime={m.sent_at}>
                        {m.direction === "inbound" ? t.inbound : t.outbound} · {formatDateTime(m.sent_at, locale)}
                      </time>
                    </div>
                  ))}
                </div>

                <p className="alert info">{t.readOnly}</p>
              </>
            ) : (
              <p className="empty">{t.pick}</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
