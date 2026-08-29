"use client";

import { useMemo, useState } from "react";
import type { Medication } from "@/lib/types";

export function MedicationsBrowser({ medications }: { medications: Medication[] }) {
  const [q, setQ] = useState("");
  const cats = useMemo(
    () => ["전체", ...Array.from(new Set(medications.map((m) => m.category)))],
    [medications],
  );
  const [cat, setCat] = useState("전체");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return medications.filter((m) => {
      if (cat !== "전체" && m.category !== cat) return false;
      if (!n) return true;
      return [m.name, m.generic_name, m.indication, m.notes]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(n));
    });
  }, [medications, q, cat]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="상품명, 성분명, 적응증 검색"
          className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-[var(--line)] bg-white p-5"
          >
            <p className="text-xs text-teal-800">{m.category}</p>
            <h2 className="mt-1 text-lg font-semibold">{m.name}</h2>
            {m.generic_name ? (
              <p className="text-sm text-stone-500">{m.generic_name}</p>
            ) : null}
            {m.indication ? (
              <p className="mt-3 text-sm">
                <span className="font-medium">적응: </span>
                {m.indication}
              </p>
            ) : null}
            {m.dosage ? (
              <p className="mt-1 text-sm">
                <span className="font-medium">용법: </span>
                {m.dosage}
              </p>
            ) : null}
            {m.notes ? (
              <p className="mt-2 text-sm leading-6 text-stone-600">{m.notes}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
