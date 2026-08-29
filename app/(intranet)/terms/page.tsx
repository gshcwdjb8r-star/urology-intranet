import { addTerm } from "@/lib/actions/knowledge";
import { TermsBrowser } from "@/components/terms-browser";
import { requireUser } from "@/lib/auth";
import type { Term } from "@/lib/types";

export default async function TermsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("terms").select("*").order("abbreviation");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">약어 · 용어</h1>
        <p className="mt-1 text-sm text-stone-600">
          진료 기록과 인수인계에 쓰이는 비뇨의학 약어와 terminology입니다.
        </p>
      </header>
      <TermsBrowser terms={(data ?? []) as Term[]} />
      <form
        action={addTerm}
        className="grid gap-3 rounded-2xl border border-dashed border-stone-300 bg-white p-5 sm:grid-cols-2"
      >
        <h2 className="font-medium sm:col-span-2">용어 추가</h2>
        <input name="abbreviation" placeholder="약어 (예: TURP)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="term" required placeholder="영문 또는 용어명" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="korean" placeholder="한글" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <select name="category" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="약어">약어</option>
          <option value="용어">용어</option>
        </select>
        <textarea
          name="definition"
          required
          rows={3}
          placeholder="설명"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <button
          type="submit"
          className="w-fit rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
        >
          추가
        </button>
      </form>
    </div>
  );
}
