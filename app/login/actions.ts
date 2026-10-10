"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(formData: FormData) {
  const { email, password } = credentials(formData);
  if (!email || !password) redirect("/login?error=invalid");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=invalid");

  redirect("/");
}

export async function signUp(formData: FormData) {
  const { email, password } = credentials(formData);
  if (!email) redirect("/login?mode=signup&error=invalid");
  if (password.length < 8) redirect("/login?mode=signup&error=short");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = h.get("origin") ?? `${proto}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) redirect("/login?mode=signup&error=generic");

  // With email confirmation off, Supabase returns a session straight away.
  if (data.session) redirect("/");
  redirect("/login?notice=check-email");
}
