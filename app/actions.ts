"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE, getLocale, isLocale } from "@/lib/i18n";
import { normalizePhone } from "@/lib/phone";
import { getSession, requireWorkspace } from "@/lib/workspace";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function setLocale(formData: FormData) {
  const value = text(formData, "locale");
  if (isLocale(value)) {
    (await cookies()).set(LOCALE_COOKIE, value, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // Return to the page the person was on.
  let back = "/";
  try {
    const referer = (await headers()).get("referer");
    if (referer) {
      const url = new URL(referer);
      back = `${url.pathname}${url.search}`;
    }
  } catch {
    back = "/";
  }
  redirect(back.startsWith("/") && !back.startsWith("//") ? back : "/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createWorkspace(formData: FormData) {
  const name = text(formData, "name");
  if (name.length < 2 || name.length > 80) redirect("/onboarding?error=1");

  const { supabase, user } = await getSession();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("create_workspace", {
    p_name: name,
    p_locale: await getLocale(),
  });
  if (error) redirect("/onboarding?error=1");

  redirect("/");
}

export async function createContact(formData: FormData) {
  const { supabase, user, workspace } = await requireWorkspace();

  const fullName = text(formData, "full_name");
  const alias = text(formData, "alias");
  const phoneRaw = text(formData, "phone");
  const email = text(formData, "email");
  if (!fullName) redirect("/contacts?error=create");

  let phone: string | null = null;
  if (phoneRaw) {
    phone = normalizePhone(phoneRaw);
    if (!phone) redirect("/contacts?error=phone");
  }

  const { error } = await supabase.from("contacts").insert({
    workspace_id: workspace.id,
    full_name: fullName,
    name_aliases: alias ? [alias] : [],
    phone_e164: phone,
    email: email || null,
    owner_id: user.id,
    source: "manual",
  });
  if (error) redirect("/contacts?error=create");

  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function createDeal(formData: FormData) {
  const { supabase, user, workspace } = await requireWorkspace();

  const title = text(formData, "title");
  const stageId = text(formData, "stage_id");
  const contactId = text(formData, "contact_id");
  const amount = Number(text(formData, "amount") || "0");
  if (!title || !stageId || !Number.isFinite(amount) || amount < 0) {
    redirect("/pipeline?error=create");
  }

  const { data: stage } = await supabase
    .from("pipeline_stages")
    .select("is_won, is_lost")
    .eq("id", stageId)
    .maybeSingle();
  if (!stage) redirect("/pipeline?error=create");

  const { error } = await supabase.from("deals").insert({
    workspace_id: workspace.id,
    title,
    amount,
    currency: workspace.default_currency,
    stage_id: stageId,
    contact_id: contactId || null,
    owner_id: user.id,
    status: stage.is_won ? "won" : stage.is_lost ? "lost" : "open",
  });
  if (error) redirect("/pipeline?error=create");

  revalidatePath("/pipeline");
  revalidatePath("/");
  redirect("/pipeline");
}

export async function moveDeal(formData: FormData) {
  const { supabase } = await requireWorkspace();

  const dealId = text(formData, "deal_id");
  const stageId = text(formData, "stage_id");
  if (!dealId || !stageId) redirect("/pipeline?error=move");

  const { data: stage } = await supabase
    .from("pipeline_stages")
    .select("is_won, is_lost")
    .eq("id", stageId)
    .maybeSingle();
  if (!stage) redirect("/pipeline?error=move");

  const { error } = await supabase
    .from("deals")
    .update({
      stage_id: stageId,
      status: stage.is_won ? "won" : stage.is_lost ? "lost" : "open",
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", dealId);
  if (error) redirect("/pipeline?error=move");

  revalidatePath("/pipeline");
  revalidatePath("/");
  redirect("/pipeline");
}
