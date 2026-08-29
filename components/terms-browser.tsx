"use client";

import { useMemo, useState } from "react";
import type { Term } from "@/lib/types";

export function TermsBrowser({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"전체" | "약어" | "용어">("전체");

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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">구분</th>
              <th className="px-4 py-3 font-medium">약어 / 용어</th>
              <th className="px-4 py-3 font-medium">한글</th>
              <th className="px-4 py-3 font-medium">설명</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-[var(--line)] align-top">
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
