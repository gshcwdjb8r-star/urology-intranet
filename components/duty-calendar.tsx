"use client";

import { useMemo, useState } from "react";
import { addDutyShift, deleteDutyShift } from "@/lib/actions/duty";
import { DUTY_LABELS, DUTY_SHORT } from "@/lib/constants";
import type { DutyShift, DutyType } from "@/lib/types";
import { formatKoreanDate, monthGrid, toDateKey } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const TYPE_ORDER: DutyType[] = ["staff", "trainee", "nurse"];
const TYPE_CHIP: Record<DutyType, string> = {
  staff: "bg-teal-700/10 text-teal-900",
  trainee: "bg-amber-100 text-amber-950",
  nurse: "bg-rose-100 text-rose-950",
};

function sortShifts(list: DutyShift[]) {
  return [...list].sort((a, b) => {
    const typeDiff = TYPE_ORDER.indexOf(a.duty_type) - TYPE_ORDER.indexOf(b.duty_type);
    if (typeDiff !== 0) return typeDiff;
    return a.person_name.localeCompare(b.person_name, "ko");
  });
}

export function DutyCalendar({
  shifts,
  initialType,
}: {
  shifts: DutyShift[];
  initialType?: DutyType;
}) {
  const todayKey = toDateKey();
  const [y, m] = todayKey.split("-").map(Number);
  const [cursor, setCursor] = useState(() => new Date(y, (m ?? 1) - 1, 1));
  const [addType, setAddType] = useState<DutyType>(initialType ?? "staff");
  const [selected, setSelected] = useState(todayKey);

  const cells = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, DutyShift[]>();
    for (const shift of shifts) {
      const list = map.get(shift.duty_date) ?? [];
      list.push(shift);
      map.set(shift.duty_date, list);
    }
    for (const [key, list] of map) {
      map.set(key, sortShifts(list));
    }
    return map;
  }, [shifts]);

  const selectedShifts = byDate.get(selected) ?? [];
  const monthLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(cursor);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-[var(--line)] px-2 py-1 text-sm"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
            >
              이전
            </button>
            <h2 className="min-w-36 text-center text-lg font-semibold">{monthLabel}</h2>
            <button
              type="button"
              className="rounded-md border border-[var(--line)] px-2 py-1 text-sm"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
            >
              다음
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {TYPE_ORDER.map((key) => (
              <span
                key={key}
                className={`rounded-full px-2 py-0.5 ${TYPE_CHIP[key]}`}
              >
                {DUTY_SHORT[key]}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 text-center text-xs text-stone-500">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)]">
          {cells.map((date) => {
            const key = toDateKey(date);
            const inMonth = date.getMonth() === cursor.getMonth();
            const names = byDate.get(key) ?? [];
            const isSelected = key === selected;
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`min-h-28 bg-white p-1.5 text-left transition sm:min-h-32 ${
                  inMonth ? "" : "bg-stone-50 text-stone-400"
                } ${isSelected ? "ring-2 ring-inset ring-teal-700" : ""}`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday ? "bg-[var(--navy)] text-white" : ""
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {names.slice(0, 4).map((s) => (
                    <p
                      key={s.id}
                      className={`truncate rounded px-1 text-[10px] leading-4 sm:text-[11px] ${TYPE_CHIP[s.duty_type]}`}
                    >
                      {s.person_name}
                    </p>
                  ))}
                  {names.length > 4 ? (
                    <p className="text-[10px] text-stone-500">+{names.length - 4}</p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-[var(--line)] bg-white p-5">
        <p className="text-xs text-stone-500">그날 당직</p>
        <h3 className="mt-1 text-lg font-semibold">{formatKoreanDate(selected)}</h3>
        <div className="mt-4 space-y-4">
          {TYPE_ORDER.map((key) => {
            const list = selectedShifts.filter((s) => s.duty_type === key);
            return (
              <div key={key}>
                <p className="mb-1.5 text-xs font-medium text-stone-500">{DUTY_LABELS[key]}</p>
                {list.length === 0 ? (
                  <p className="text-sm text-stone-400">미정</p>
                ) : (
                  <ul className="space-y-2">
                    {list.map((shift) => (
                      <li
                        key={shift.id}
                        className="flex items-start justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{shift.person_name}</p>
                          {shift.note ? (
                            <p className="text-xs text-stone-500">{shift.note}</p>
                          ) : null}
                        </div>
                        <form action={deleteDutyShift}>
                          <input type="hidden" name="id" value={shift.id} />
                          <button
                            type="submit"
                            className="text-xs text-stone-400 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <form action={addDutyShift} className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
          <input type="hidden" name="duty_date" value={selected} />
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">종류</span>
            <select
              name="duty_type"
              value={addType}
              onChange={(e) => setAddType(e.target.value as DutyType)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            >
              {TYPE_ORDER.map((key) => (
                <option key={key} value={key}>
                  {DUTY_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">이름</span>
            <input
              name="person_name"
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="당직자 이름"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">메모 (선택)</span>
            <input
              name="note"
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="예: 온콜, 주말"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--navy)] py-2 text-sm font-medium text-white"
          >
            당직 추가
          </button>
        </form>
      </aside>
    </div>
  );
}
