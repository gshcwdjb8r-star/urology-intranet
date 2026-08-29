"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

function parseConsentItems(rawItems: string) {
  return rawItems
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split(":");
      return {
        title: title.trim(),
        text: rest.join(":").trim() || title.trim(),
      };
    });
}

export async function addTerm(formData: FormData) {
  const { supabase } = await requireUser();
  const term = String(formData.get("term") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();
  if (!term || !definition) return;
  await supabase.from("terms").insert({
    term,
    abbreviation: String(formData.get("abbreviation") ?? "").trim() || null,
    korean: String(formData.get("korean") ?? "").trim() || null,
    category: String(formData.get("category") ?? "약어"),
    definition,
  });
  revalidatePath("/terms");
}

export async function addProcedure(formData: FormData) {
  const { supabase } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;
  await supabase.from("procedures").insert({
    title,
    category: String(formData.get("category") ?? "술기"),
    indication: String(formData.get("indication") ?? "").trim() || null,
    content,
    complications: String(formData.get("complications") ?? "").trim() || null,
    sort_order: 100,
  });
  revalidatePath("/procedures");
}

export async function addMedication(formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await supabase.from("medications").insert({
    name,
    generic_name: String(formData.get("generic_name") ?? "").trim() || null,
    category: String(formData.get("category") ?? "기타"),
    indication: String(formData.get("indication") ?? "").trim() || null,
    dosage: String(formData.get("dosage") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  });
  revalidatePath("/medications");
}

export async function addOrderSet(formData: FormData) {
  const { supabase } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;
  await supabase.from("order_sets").insert({
    title,
    category: String(formData.get("category") ?? "기타"),
    content,
    sort_order: 100,
  });
  revalidatePath("/orders");
}

export async function addConsentGuide(formData: FormData) {
  const { supabase } = await requireUser();
  const surgery_name = String(formData.get("surgery_name") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const items = parseConsentItems(String(formData.get("items") ?? ""));
  if (!surgery_name || items.length === 0) return;
  await supabase.from("consent_guides").insert({
    surgery_name,
    summary,
    notes,
    items,
    sort_order: 100,
  });
  revalidatePath("/consents");
}

export async function updateTerm(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const term = String(formData.get("term") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();
  if (!id || !term || !definition) return;
  await supabase
    .from("terms")
    .update({
      term,
      abbreviation: String(formData.get("abbreviation") ?? "").trim() || null,
      korean: String(formData.get("korean") ?? "").trim() || null,
      category: String(formData.get("category") ?? "약어"),
      definition,
    })
    .eq("id", id);
  revalidatePath("/terms");
}

export async function deleteTerm(formData: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("terms").delete().eq("id", String(formData.get("id")));
  revalidatePath("/terms");
}

export async function updateProcedure(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !title || !content) return;
  await supabase
    .from("procedures")
    .update({
      title,
      category: String(formData.get("category") ?? "술기"),
      indication: String(formData.get("indication") ?? "").trim() || null,
      content,
      complications: String(formData.get("complications") ?? "").trim() || null,
    })
    .eq("id", id);
  revalidatePath("/procedures");
  revalidatePath(`/procedures/${id}`);
}

export async function deleteProcedure(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  await supabase.from("procedures").delete().eq("id", id);
  revalidatePath("/procedures");
  if (String(formData.get("from")) === "detail") redirect("/procedures");
}

export async function updateMedication(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await supabase
    .from("medications")
    .update({
      name,
      generic_name: String(formData.get("generic_name") ?? "").trim() || null,
      category: String(formData.get("category") ?? "기타"),
      indication: String(formData.get("indication") ?? "").trim() || null,
      dosage: String(formData.get("dosage") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    })
    .eq("id", id);
  revalidatePath("/medications");
}

export async function deleteMedication(formData: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("medications").delete().eq("id", String(formData.get("id")));
  revalidatePath("/medications");
}

export async function updateOrderSet(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !title || !content) return;
  await supabase
    .from("order_sets")
    .update({
      title,
      category: String(formData.get("category") ?? "기타"),
      content,
    })
    .eq("id", id);
  revalidatePath("/orders");
}

export async function deleteOrderSet(formData: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("order_sets").delete().eq("id", String(formData.get("id")));
  revalidatePath("/orders");
}

export async function updateConsentGuide(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const surgery_name = String(formData.get("surgery_name") ?? "").trim();
  const items = parseConsentItems(String(formData.get("items") ?? ""));
  if (!id || !surgery_name || items.length === 0) return;
  await supabase
    .from("consent_guides")
    .update({
      surgery_name,
      summary: String(formData.get("summary") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      items,
    })
    .eq("id", id);
  revalidatePath("/consents");
  revalidatePath(`/consents/${id}`);
}

export async function deleteConsentGuide(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  await supabase.from("consent_guides").delete().eq("id", id);
  revalidatePath("/consents");
  if (String(formData.get("from")) === "detail") redirect("/consents");
}
