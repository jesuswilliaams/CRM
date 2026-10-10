// Row shapes for the tables this app reads. Source of truth: the Supabase schema
// (migrations crm_foundation_tables, crm_rls_policies, crm_functions_and_views).

export type MemberRole = "owner" | "manager" | "rep";

export type Workspace = {
  id: string;
  name: string;
  followup_days: number;
  default_currency: string;
};

export type Stage = {
  id: string;
  name: string;
  position: number;
  is_won: boolean;
  is_lost: boolean;
};

export type Contact = {
  id: string;
  full_name: string;
  phone_e164: string | null;
  email: string | null;
  name_aliases: string[];
  created_at: string;
};

export type Deal = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stage_id: string;
  status: "open" | "won" | "lost";
  contact_id: string | null;
  last_activity_at: string;
  contacts: { full_name: string } | null;
};

export type StageSummary = {
  stage_id: string;
  stage_name: string;
  position: number;
  deals_count: number;
  total_amount: number;
};

export type OverdueDeal = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  last_activity_at: string;
};

export type Conversation = {
  id: string;
  last_message_at: string;
  status: string;
  contacts: { full_name: string; phone_e164: string | null } | null;
};

export type Message = {
  id: string;
  direction: "inbound" | "outbound";
  body: string | null;
  sent_at: string;
};
