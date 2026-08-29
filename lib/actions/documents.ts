"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function saveDocument(formData: FormData) {
  const { user, supabase } = await requireUser();
  const rawTemplateId = String(formData.get("template_id") ?? "");
  const formTitle = String(formData.get("form_title") ?? "").trim();
  const templateId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    rawTemplateId,
  )
    ? rawTemplateId
    : "";
  const id = String(formData.get("id") ?? "");
  const entries: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "template_id" || key === "id" || key === "title" || key === "form_title") continue;
    entries[key] = String(value);
  }

  let templateTitle = formTitle || "문서";
  if (templateId) {
    const { data: template } = await supabase
      .from("document_templates")
      .select("title")
      .eq("id", templateId)
      .maybeSingle();
    if (template?.title) templateTitle = template.title;
  }

  const patient = entries.patient_name?.trim();
  const title = patient ? `${templateTitle} · ${patient}` : templateTitle;

  if (id) {
    await supabase
      .from("documents")
      .update({ data: entries, title, updated_at: new Date().toISOString() })
      .eq("id", id);
    revalidatePath("/documents");
    revalidatePath(`/documents/saved/${id}`);
    redirect(`/documents/saved/${id}`);
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      template_id: templateId || null,
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
  redirect(`/documents/saved/${data.id}`);
}

export async function deleteDocument(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/documents");
  redirect("/documents");
}
