import { DutyCalendar } from "@/components/duty-calendar";
import { requireUser } from "@/lib/auth";
import type { DutyShift } from "@/lib/types";

export default async function DutyPage() {
  const { supabase } = await requireUser();
  const from = new Date();
  from.setMonth(from.getMonth() - 2);
  const to = new Date();
  to.setMonth(to.getMonth() + 4);

  const { data } = await supabase
    .from("duty_shifts")
    .select("*")
    .gte("duty_date", from.toISOString().slice(0, 10))
    .lte("duty_date", to.toISOString().slice(0, 10))
    .order("duty_date");

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">당직표</h1>
        <p className="mt-1 text-sm text-stone-600">
          스텝, 인턴·레지던트, 전담간호사 당직은 서로 다른 일정으로 운영됩니다. 상단
          탭에서 종류를 바꿔 입력하세요.
        </p>
      </header>
      <DutyCalendar shifts={(data ?? []) as DutyShift[]} />
    </div>
  );
}
