"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import type { OutpatientScheduleEntry, OutpatientSession } from "@/lib/types";

const WEEKDAYS = [1, 2, 3, 4, 5] as const;
const SESSIONS: OutpatientSession[] = ["am", "pm"];
const SCHEDULE_TITLE = "__OUTPATIENT_SCHEDULE__";

function parseNames(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[,\n/]+/)
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export async function saveOutpatientSchedule(formData: FormData) {
  const { user, supabase } = await requireUser();
  const updatedAt = new Date().toISOString();

  const schedule: OutpatientScheduleEntry[] = WEEKDAYS.flatMap((weekday) =>
    SESSIONS.flatMap((session) => {
      const names = parseNames(formData.get(`schedule_${weekday}_${session}`));
      if (names.length === 0) return [];
      return [{
        id: `${weekday}-${session}`,
        weekday,
        session,
        doctor_names: names,
        updated_by: user.id,
        updated_at: updatedAt,
      }];
    }),
  );

  const { data: existing, error: lookupError } = await supabase
    .from("notices")
    .select("id")
    .eq("title", SCHEDULE_TITLE)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase
      .from("notices")
      .update({ body: JSON.stringify(schedule) })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("notices").insert({
      title: SCHEDULE_TITLE,
      body: JSON.stringify(schedule),
      pinned: false,
      created_by: user.id,
    });
    if (error) throw error;
  }

  revalidatePath("/");
}
