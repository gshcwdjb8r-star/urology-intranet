"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { SNIPPET_CATEGORIES, normalizeCategory } from "@/lib/snippets";

function readFields(formData: FormData) {
  const category = normalizeCategory(String(formData.get("category") ?? "").trim());
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!(SNIPPET_CATEGORIES as readonly string[]).includes(category) || !title || !body) {
    return null;
  }
  return { category, title, body };
}

export async function addSnippet(formData: FormData) {
  const { user, supabase } = await requireUser();
  const fields = readFields(formData);
  if (!fields) return;

  await supabase.from("documents").insert({
    title: fields.title,
    data: { category: fields.category, body: fields.body },
    created_by: user.id,
  });
  revalidatePath("/documents");
}

export async function saveSnippet(formData: FormData) {
  const { user, supabase } = await requireUser();
  const fields = readFields(formData);
  if (!fields) return;

  const id = String(formData.get("id") ?? "");
  const sourceId = String(formData.get("source_id") ?? "").trim();

  if (id && !id.startsWith("default-")) {
    await supabase
      .from("documents")
      .update({
        title: fields.title,
        data: {
          category: fields.category,
          body: fields.body,
          ...(sourceId ? { sourceId } : {}),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    revalidatePath("/documents");
    return;
  }

  await supabase.from("documents").insert({
    title: fields.title,
    data: {
      category: fields.category,
      body: fields.body,
      ...(sourceId ? { sourceId } : {}),
    },
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
