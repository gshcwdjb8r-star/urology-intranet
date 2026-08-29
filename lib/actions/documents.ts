"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function addSnippet(formData: FormData) {
  const { user, supabase } = await requireUser();
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!category || !title || !body) return;

  await supabase.from("documents").insert({
    title,
    data: { category, body },
    created_by: user.id,
  });
  revalidatePath("/documents");
}

export async function deleteSnippet(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id || id.startsWith("default-")) return;
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/documents");
}
