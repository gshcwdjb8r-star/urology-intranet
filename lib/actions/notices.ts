"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function createNotice(formData: FormData) {
  const { user, supabase } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  if (!title || !body) return;

  await supabase.from("notices").insert({
    title,
    body,
    pinned,
    created_by: user.id,
  });
  revalidatePath("/notices");
  revalidatePath("/");
}

export async function deleteNotice(formData: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("notices").delete().eq("id", String(formData.get("id")));
  revalidatePath("/notices");
  revalidatePath("/");
}

export async function toggleNoticePin(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const pinned = String(formData.get("pinned")) === "true";
  await supabase.from("notices").update({ pinned: !pinned }).eq("id", id);
  revalidatePath("/notices");
  revalidatePath("/");
}
