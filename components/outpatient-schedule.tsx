"use client";

import { useState } from "react";
import { saveOutpatientSchedule } from "@/lib/actions/outpatient-schedule";
import type { OutpatientScheduleEntry, OutpatientSession } from "@/lib/types";

const WEEKDAYS = [
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
] as const;

const SESSIONS: { value: OutpatientSession; label: string }[] = [
  { value: "am", label: "오전" },
  { value: "pm", label: "오후" },
];

export function OutpatientSchedule({
  entries,
}: {
  entries: OutpatientScheduleEntry[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSave(formData: FormData) {
    await saveOutpatientSchedule(formData);
    setIsEditing(false);
  }

  const schedule = new Map(
    entries.map((entry) => [
      `${entry.weekday}-${entry.session}`,
      entry.doctor_names,
    ]),
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">외래 시간표</h2>
        <button
          type="button"
          onClick={() => setIsEditing((open) => !open)}
          className="text-[11px] font-normal text-stone-600 hover:text-stone-900 hover:underline"
          aria-expanded={isEditing}
        >
          {isEditing ? "편집 닫기" : "시간표 편집"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
        <table className="w-full min-w-[560px] table-fixed border-collapse">
          <thead>
            <tr className="bg-stone-50">
              <th className="w-20 border-b border-r border-[var(--line)] px-2 py-3 text-sm font-medium text-stone-500">
                구분
              </th>
              {WEEKDAYS.map((day) => (
                <th
                  key={day.value}
                  className="border-b border-r border-[var(--line)] px-2 py-3 text-sm font-semibold last:border-r-0"
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((session) => (
              <tr key={session.value}>
                <th className="border-r border-b border-[var(--line)] bg-stone-50 px-2 py-4 text-sm font-medium text-stone-500 last:border-b-0">
                  {session.label}
                </th>
                {WEEKDAYS.map((day) => {
                  const names = schedule.get(`${day.value}-${session.value}`) ?? [];
                  return (
                    <td
                      key={day.value}
                      className="border-r border-b border-[var(--line)] px-2 py-4 text-center align-middle last:border-r-0"
                    >
                      {names.length === 0 ? (
                        <span className="text-sm text-stone-400">미정</span>
                      ) : (
                        <div className="space-y-1">
                          {names.map((name) => (
                            <p key={name} className="text-sm font-medium text-[var(--navy)]">
                              {name}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing ? (
        <form
          action={handleSave}
          className="mt-3 rounded-xl border border-[var(--line)] bg-white p-4"
        >
          <p className="mb-4 text-xs text-stone-500">
            한 세션에 두 명이면 쉼표로 구분해 입력하세요.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SESSIONS.map((session) => (
              <fieldset key={session.value} className="rounded-xl bg-stone-50 p-3">
                <legend className="px-1 text-sm font-semibold">{session.label}</legend>
                <div className="mt-2 space-y-2">
                  {WEEKDAYS.map((day) => {
                    const fieldName = `schedule_${day.value}_${session.value}`;
                    const names = schedule.get(`${day.value}-${session.value}`) ?? [];
                    return (
                      <label key={day.value} className="flex items-center gap-3">
                        <span className="w-6 shrink-0 text-sm text-stone-600">{day.label}</span>
                        <input
                          name={fieldName}
                          defaultValue={names.join(", ")}
                          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                          placeholder="스텝 이름"
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-[var(--navy)] py-2.5 text-sm font-medium text-white"
          >
            외래 시간표 저장
          </button>
        </form>
      ) : null}
    </section>
  );
}
