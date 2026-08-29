"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

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
  const rawItems = String(formData.get("items") ?? "");
  const items = rawItems
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
