"use client";

import { useMemo, useState } from "react";
import { addDutyShift, deleteDutyShift } from "@/lib/actions/duty";
import { DUTY_LABELS } from "@/lib/constants";
import type { DutyShift, DutyType } from "@/lib/types";
import { monthGrid, toDateKey } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function DutyCalendar({
  shifts,
  initialType,
}: {
  shifts: DutyShift[];
  initialType?: DutyType;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [type, setType] = useState<DutyType>(initialType ?? "staff");
  const [selected, setSelected] = useState(toDateKey(today));

  const cells = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, DutyShift[]>();
    for (const shift of shifts.filter((s) => s.duty_type === type)) {
      const list = map.get(shift.duty_date) ?? [];
      list.push(shift);
      map.set(shift.duty_date, list);
    }
    return map;
  }, [shifts, type]);

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
          <div className="flex rounded-lg bg-stone-100 p-1 text-xs sm:text-sm">
            {(Object.keys(DUTY_LABELS) as DutyType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setType(key)}
                className={`rounded-md px-2.5 py-1.5 ${
                  type === key ? "bg-white font-medium shadow-sm" : "text-stone-500"
                }`}
              >
                {DUTY_LABELS[key]}
              </button>
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
            const isToday = key === toDateKey(today);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`min-h-24 bg-white p-1.5 text-left transition sm:min-h-28 ${
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
                  {names.slice(0, 3).map((s) => (
                    <p
                      key={s.id}
                      className="truncate rounded bg-teal-700/10 px-1 text-[11px] text-teal-900"
                    >
                      {s.person_name}
                    </p>
                  ))}
                  {names.length > 3 ? (
                    <p className="text-[10px] text-stone-500">+{names.length - 3}</p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-[var(--line)] bg-white p-5">
        <p className="text-xs text-stone-500">{DUTY_LABELS[type]}</p>
        <h3 className="mt-1 text-lg font-semibold">
          {new Intl.DateTimeFormat("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
          }).format(new Date(selected + "T00:00:00"))}
        </h3>
        <ul className="mt-4 space-y-2">
          {selectedShifts.length === 0 ? (
            <li className="text-sm text-stone-500">등록된 당직자가 없습니다.</li>
          ) : (
            selectedShifts.map((shift) => (
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
                  <button type="submit" className="text-xs text-stone-400 hover:text-red-700">
                    삭제
                  </button>
                </form>
              </li>
            ))
          )}
        </ul>

        <form action={addDutyShift} className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
          <input type="hidden" name="duty_type" value={type} />
          <input type="hidden" name="duty_date" value={selected} />
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
