"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string } | undefined;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "스텝");

  if (!name) return { error: "이름을 입력해 주세요." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  });

  if (error) {
    return { error: error.message === "User already registered" ? "이미 등록된 이메일입니다." : error.message };
  }

  if (!data.session) {
    return {
      error:
        "가입은 되었지만 이메일 확인이 필요합니다. 인트라넷이라면 Supabase Authentication → Providers → Email에서 Confirm email을 꺼 주세요.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateRole(formData: FormData) {
  const { user, supabase } = await requireUser();
  const role = String(formData.get("role") ?? "");
  if (!(ROLES as readonly string[]).includes(role)) return;

  await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  await supabase.auth.updateUser({ data: { role } });
  revalidatePath("/", "layout");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
