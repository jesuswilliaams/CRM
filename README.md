# CRM

CRM SaaS for small and medium businesses in Morocco, MENA and Europe: WhatsApp conversations, pipeline and contacts, in Darija, French and Arabic (full RTL).

Built from the product requirements document (MVP scope). Stack: Next.js (App Router), Supabase (Postgres, Auth, Row Level Security), Vercel.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm run dev
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key. Safe in the browser; Row Level Security protects the data |

Never put a service role key in a `NEXT_PUBLIC_` variable. The WhatsApp webhook (not built yet) is the only place that needs it.

## What exists

- Email and password sign-in, workspace creation with a default pipeline
- Dashboard: deals by stage, open amount, overdue follow-ups
- Pipeline: add deals, move them between stages
- Contacts: add, search (accent-insensitive, phone-aware), alternate spelling of a name
- Messages: read-only view of conversations (sending needs WhatsApp Business API)
- Interface in Darija, French and Arabic, switchable at any time

## Not built yet

WhatsApp webhook and sending, Excel/CSV import, consent records screen, export and erase screens, AI summaries, drag and drop on the board, Arabic/Latin transliteration in search.

## Database

The schema lives in Supabase (migrations `crm_foundation_tables`, `crm_rls_policies`, `crm_functions_and_views`). Every table has Row Level Security; users only see rows of workspaces they belong to.
