"use client";

import { useMemo, useState } from "react";
import { deleteTerm, updateTerm } from "@/lib/actions/knowledge";
import type { Term } from "@/lib/types";

export function TermsBrowser({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"전체" | "약어" | "용어">("전체");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return terms.filter((t) => {
      if (cat !== "전체" && t.category !== cat) return false;
      if (!n) return true;
      return [t.term, t.abbreviation, t.korean, t.definition]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(n));
    });
  }, [terms, q, cat]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="약어, 영어, 한글, 설명 검색"
          className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        />
        <div className="flex rounded-lg bg-stone-100 p-1 text-sm">
          {(["전체", "약어", "용어"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-md px-3 py-1.5 ${cat === c ? "bg-white shadow-sm" : "text-stone-500"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">구분</th>
              <th className="px-4 py-3 font-medium">약어 / 용어</th>
              <th className="px-4 py-3 font-medium">한글</th>
              <th className="px-4 py-3 font-medium">설명</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-[var(--line)] align-top">
                {editingId === t.id ? (
                  <td colSpan={5} className="px-4 py-3">
                    <form action={updateTerm} className="grid gap-2 sm:grid-cols-2">
                      <input type="hidden" name="id" value={t.id} />
                      <input name="abbreviation" defaultValue={t.abbreviation ?? ""} placeholder="약어" className="rounded-lg border border-stone-300 px-3 py-2" />
                      <input name="term" required defaultValue={t.term} placeholder="영문" className="rounded-lg border border-stone-300 px-3 py-2" />
                      <input name="korean" defaultValue={t.korean ?? ""} placeholder="한글" className="rounded-lg border border-stone-300 px-3 py-2" />
                      <select name="category" defaultValue={t.category} className="rounded-lg border border-stone-300 px-3 py-2">
                        <option value="약어">약어</option>
                        <option value="용어">용어</option>
                      </select>
                      <textarea name="definition" required defaultValue={t.definition} rows={3} className="rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2" />
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-lg bg-[var(--navy)] px-3 py-1.5 text-xs text-white">저장</button>
                        <button type="button" className="text-xs text-stone-500" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="ml-auto text-xs text-stone-400 hover:text-red-700" onClick={async () => { if (!confirm("정말 삭제하시겠습니까?")) return; const fd = new FormData(); fd.append("id", t.id); await deleteTerm(fd); }}>삭제</button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-teal-700/10 px-2 py-0.5 text-xs text-teal-900">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.abbreviation || t.term}</p>
                      {t.abbreviation ? (
                        <p className="text-xs text-stone-500">{t.term}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{t.korean}</td>
                    <td className="px-4 py-3 leading-6 text-stone-700">{t.definition}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button type="button" className="text-xs text-teal-800" onClick={() => setEditingId(t.id)}>수정</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-stone-500">검색 결과가 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}
