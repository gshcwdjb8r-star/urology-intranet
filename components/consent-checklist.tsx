"use client";

import { useState } from "react";
import type { ConsentGuide } from "@/lib/types";

export function ConsentChecklist({ guide }: { guide: ConsentGuide }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const items = guide.items ?? [];
  const done = items.filter((_, i) => checked[i]).length;

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between text-sm">
        <p className="text-stone-600">
          설명 진행 {done}/{items.length}
        </p>
        <button
          type="button"
          className="text-teal-800 underline-offset-2 hover:underline"
          onClick={() => setChecked({})}
        >
          체크 초기화
        </button>
      </div>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`}>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-[var(--line)] bg-white p-4 hover:border-teal-700/40">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-teal-800"
                checked={Boolean(checked[index])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [index]: e.target.checked }))
                }
              />
              <span>
                <span className="block font-medium text-[var(--navy)]">
                  {index + 1}. {item.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-stone-600">
                  {item.text}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}
