import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { addProcedure, deleteProcedure } from "@/lib/actions/knowledge";
import { requireUser } from "@/lib/auth";
import type { Procedure } from "@/lib/types";

export default async function ProceduresPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const { supabase } = await requireUser();
  let query = supabase.from("procedures").select("*").order("sort_order");
  if (cat === "술기" || cat === "수술") {
    query = query.eq("category", cat);
  }
  const { data } = await query;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">기본 술기 · 수술</h1>
        <p className="mt-1 text-sm text-stone-600">
          병동·시술실에서 자주 하는 술기와 대표 수술의 흐름입니다. 환자 상태에 따라
          집도의 판단이 우선합니다.
        </p>
        <div className="mt-3 flex gap-2 text-sm">
          <Link
            href="/procedures"
            className={`rounded-full px-3 py-1 font-medium ${!cat ? "bg-[var(--navy)] text-white!" : "bg-white border border-[var(--line)] text-stone-700"}`}
          >
            전체
          </Link>
          {(["술기", "수술"] as const).map((c) => (
            <Link
              key={c}
              href={`/procedures?cat=${c}`}
              className={`rounded-full px-3 py-1 font-medium ${cat === c ? "bg-[var(--navy)] text-white!" : "bg-white border border-[var(--line)] text-stone-700"}`}
            >
              {c}
            </Link>
          ))}
        </div>
      </header>

      <div className="grid gap-3">
        {((data ?? []) as Procedure[]).map((p) => (
          <div
            key={p.id}
            className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white p-5"
          >
            <Link href={`/procedures/${p.id}`} className="min-w-0 flex-1 hover:text-teal-800">
              <p className="text-xs text-teal-800">{p.category}</p>
              <h2 className="mt-1 font-semibold">{p.title}</h2>
              {p.indication ? (
                <p className="mt-2 text-sm text-stone-600">적응: {p.indication}</p>
              ) : null}
            </Link>
            <div className="flex shrink-0 gap-2 pt-1">
              <Link href={`/procedures/${p.id}`} className="text-xs text-teal-800">수정</Link>
              <DeleteButton id={p.id} />
            </div>
          </div>
        ))}
      </div>

      <form action={addProcedure} className="space-y-3 rounded-2xl border border-dashed border-stone-300 bg-white p-5">
        <h2 className="font-medium">항목 추가</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="제목" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <select name="category" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
            <option value="술기">술기</option>
            <option value="수술">수술</option>
          </select>
        </div>
        <input name="indication" placeholder="적응증" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <textarea name="content" required rows={5} placeholder="절차·내용" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input name="complications" placeholder="합병증" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
          추가
        </button>
      </form>
    </div>
  );
}
