"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function saveDocument(formData: FormData) {
  const { user, supabase } = await requireUser();
  const templateId = String(formData.get("template_id"));
  const id = String(formData.get("id") ?? "");
  const entries: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "template_id" || key === "id" || key === "title") continue;
    entries[key] = String(value);
  }

  const { data: template } = await supabase
    .from("document_templates")
    .select("title")
    .eq("id", templateId)
    .single();

  const patient = entries.patient_name?.trim();
  const title = patient
    ? `${template?.title ?? "문서"} · ${patient}`
    : (template?.title ?? "문서");

  if (id) {
    await supabase
      .from("documents")
      .update({ data: entries, title, updated_at: new Date().toISOString() })
      .eq("id", id);
    revalidatePath("/documents");
    revalidatePath(`/documents/${id}`);
    redirect(`/documents/${id}`);
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      template_id: templateId,
      title,
      data: entries,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "저장에 실패했습니다.");
  }

  revalidatePath("/documents");
  redirect(`/documents/${data.id}`);
}

export async function deleteDocument(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/documents");
  redirect("/documents");
}
