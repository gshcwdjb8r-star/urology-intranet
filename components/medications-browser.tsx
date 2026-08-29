"use client";

import { useMemo, useState } from "react";
import { deleteMedication, updateMedication } from "@/lib/actions/knowledge";
import type { Medication } from "@/lib/types";

export function MedicationsBrowser({ medications }: { medications: Medication[] }) {
  const [q, setQ] = useState("");
  const cats = useMemo(
    () => ["전체", ...Array.from(new Set(medications.map((m) => m.category)))],
    [medications],
  );
  const [cat, setCat] = useState("전체");
  const [editingId, setEditingId] = useState<string | null>(null);

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
            {editingId === m.id ? (
              <form action={updateMedication} className="grid gap-2">
                <input type="hidden" name="id" value={m.id} />
                <input name="name" required defaultValue={m.name} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <input name="generic_name" defaultValue={m.generic_name ?? ""} placeholder="성분명" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <input name="category" defaultValue={m.category} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <input name="indication" defaultValue={m.indication ?? ""} placeholder="적응" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <input name="dosage" defaultValue={m.dosage ?? ""} placeholder="용법" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <textarea name="notes" defaultValue={m.notes ?? ""} rows={3} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-[var(--navy)] px-3 py-1.5 text-xs text-white">저장</button>
                  <button type="button" className="text-xs text-stone-500" onClick={() => setEditingId(null)}>취소</button>
                  <button type="button" className="ml-auto text-xs text-stone-400 hover:text-red-700" onClick={async () => { if (!confirm("정말 삭제하시겠습니까?")) return; const fd = new FormData(); fd.append("id", m.id); await deleteMedication(fd); }}>삭제</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-teal-800">{m.category}</p>
                    <h2 className="mt-1 text-lg font-semibold">{m.name}</h2>
                  </div>
                  <button type="button" className="text-xs text-teal-800" onClick={() => setEditingId(m.id)}>수정</button>
                </div>
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
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
