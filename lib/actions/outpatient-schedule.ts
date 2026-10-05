"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import type { OutpatientSession } from "@/lib/types";

const WEEKDAYS = [1, 2, 3, 4, 5] as const;
const SESSIONS: OutpatientSession[] = ["am", "pm"];

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

  const changes = WEEKDAYS.flatMap((weekday) =>
    SESSIONS.map((session) => ({
      weekday,
      session,
      names: parseNames(formData.get(`schedule_${weekday}_${session}`)),
    })),
  );

  await Promise.all(
    changes.map(async ({ weekday, session, names }) => {
      if (names.length === 0) {
        const { error } = await supabase
          .from("outpatient_schedule")
          .delete()
          .eq("weekday", weekday)
          .eq("session", session);
        if (error) throw error;
        return;
      }

      const { error } = await supabase.from("outpatient_schedule").upsert(
        {
          weekday,
          session,
          doctor_names: names,
          updated_by: user.id,
          updated_at: updatedAt,
        },
        { onConflict: "weekday,session" },
      );
      if (error) throw error;
    }),
  );

  revalidatePath("/");
}
