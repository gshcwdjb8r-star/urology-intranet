import { DutyCalendar } from "@/components/duty-calendar";
import { requireUser } from "@/lib/auth";
import type { DutyShift } from "@/lib/types";
import { shiftDateKey, toDateKey } from "@/lib/utils";

export default async function DutyPage() {
  const { supabase } = await requireUser();
  const today = toDateKey();

  const { data } = await supabase
    .from("duty_shifts")
    .select("*")
    .gte("duty_date", shiftDateKey(today, -2))
    .lte("duty_date", shiftDateKey(today, 4))
    .order("duty_date");

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">당직표</h1>
        <p className="mt-1 text-sm text-stone-600">
          날짜를 누르면 그날 스텝, 인턴·레지던트, 전담간호사 당직이 함께 보입니다.
          추가할 때만 종류를 고르면 됩니다.
        </p>
      </header>
      <DutyCalendar shifts={(data ?? []) as DutyShift[]} />
    </div>
  );
}
