import Link from "next/link";
import { addConsentGuide, deleteConsentGuide } from "@/lib/actions/knowledge";
import { requireUser } from "@/lib/auth";
import type { ConsentGuide } from "@/lib/types";

export default async function ConsentsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("consent_guides")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">수술동의 설명</h1>
        <p className="mt-1 text-sm text-stone-600">
          동의서 작성 전 환자에게 설명할 항목입니다. 병원 공식 동의서를 대체하지 않으며,
          설명 누락을 줄이기 위한 체크리스트입니다.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {((data ?? []) as ConsentGuide[]).map((g) => (
          <div
            key={g.id}
            className="rounded-2xl border border-[var(--line)] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <Link href={`/consents/${g.id}`} className="min-w-0 flex-1 hover:text-teal-800">
                <h2 className="font-semibold">{g.surgery_name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-stone-600">{g.summary}</p>
                <p className="mt-3 text-xs text-stone-400">항목 {(g.items ?? []).length}개</p>
              </Link>
              <div className="flex shrink-0 gap-2">
                <Link href={`/consents/${g.id}`} className="text-xs text-teal-800">수정</Link>
                <form action={deleteConsentGuide}>
                  <input type="hidden" name="id" value={g.id} />
                  <button type="submit" className="text-xs text-stone-400 hover:text-red-700">삭제</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        action={addConsentGuide}
        className="space-y-3 rounded-2xl border border-dashed border-stone-300 bg-white p-5"
      >
        <h2 className="font-medium">설명 가이드 추가</h2>
        <input
          name="surgery_name"
          required
          placeholder="수술명"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          name="summary"
          placeholder="한 줄 요약"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <textarea
          name="items"
          required
          rows={6}
          placeholder={"한 줄에 한 항목. 예)\n출혈: 혈뇨가 지속될 수 있습니다.\n감염: 발열 시 내원합니다."}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <textarea
          name="notes"
          rows={2}
          placeholder="집도의 참고 메모 (선택)"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
        >
          추가
        </button>
      </form>
    </div>
  );
}
