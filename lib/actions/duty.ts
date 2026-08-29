"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import type { DutyType } from "@/lib/types";

export async function addDutyShift(formData: FormData) {
  const { user, supabase } = await requireUser();
  const duty_type = String(formData.get("duty_type")) as DutyType;
  const duty_date = String(formData.get("duty_date"));
  const person_name = String(formData.get("person_name") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!person_name || !duty_date) return;

  await supabase.from("duty_shifts").insert({
    duty_type,
    duty_date,
    person_name,
    note,
    created_by: user.id,
  });

  revalidatePath("/duty");
  revalidatePath("/");
}

export async function deleteDutyShift(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  await supabase.from("duty_shifts").delete().eq("id", id);
  revalidatePath("/duty");
  revalidatePath("/");
}
