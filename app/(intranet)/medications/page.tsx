import { addMedication } from "@/lib/actions/knowledge";
import { MedicationsBrowser } from "@/components/medications-browser";
import { requireUser } from "@/lib/auth";
import type { Medication } from "@/lib/types";

export default async function MedicationsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("medications").select("*").order("category");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">진료 약품</h1>
        <p className="mt-1 text-sm text-stone-600">
          과에서 자주 쓰는 약의 적응·용법·주의사항입니다. 용량은 환자 신기능·병용약에 따라
          조정하세요.
        </p>
      </header>
      <MedicationsBrowser medications={(data ?? []) as Medication[]} />
      <form action={addMedication} className="grid gap-3 rounded-2xl border border-dashed border-stone-300 bg-white p-5 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">약품 추가</h2>
        <input name="name" required placeholder="상품명" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="generic_name" placeholder="성분명" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="category" placeholder="분류 (예: 알파차단제)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="dosage" placeholder="용법" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="indication" placeholder="적응증" className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2" />
        <textarea name="notes" rows={3} placeholder="주의사항" className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2" />
        <button type="submit" className="w-fit rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
          추가
        </button>
      </form>
    </div>
  );
}
