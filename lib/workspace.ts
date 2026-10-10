import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MemberRole, Workspace } from "@/lib/types";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});

/** The signed-in user's workspace. Sends them to login or onboarding when needed. */
export const requireWorkspace = cache(async () => {
  const { supabase, user } = await getSession();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("workspace_members")
    .select("role, workspaces(id, name, followup_days, default_currency)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const row = data as unknown as { role: MemberRole; workspaces: Workspace | null } | null;
  if (!row?.workspaces) redirect("/onboarding");

  return { supabase, user, workspace: row.workspaces, role: row.role };
});
