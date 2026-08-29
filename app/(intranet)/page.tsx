import Link from "next/link";
import { DUTY_LABELS, DUTY_SHORT } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { formatKoreanDate, toDateKey } from "@/lib/utils";
import type { DutyShift, Notice } from "@/lib/types";

export default async function HomePage() {
  const { supabase, profile } = await requireUser();
  const today = toDateKey(new Date());

  const [{ data: duties }, { data: notices }] = await Promise.all([
    supabase
      .from("duty_shifts")
      .select("*")
      .eq("duty_date", today)
      .order("duty_type"),
    supabase
      .from("notices")
      .select("*, profiles(name)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const grouped: Record<string, DutyShift[]> = { staff: [], trainee: [], nurse: [] };
  for (const d of (duties ?? []) as DutyShift[]) {
    grouped[d.duty_type]?.push(d);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-stone-500">{formatKoreanDate(today)}</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--navy)]">
          {profile.name} 님, 안녕하세요
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          표시 역할: <span className="font-medium text-teal-800">{profile.role}</span>
        </p>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">오늘 당직</h2>
          <Link href="/duty" className="text-sm text-teal-800 hover:underline">
            캘린더 보기
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["staff", "trainee", "nurse"] as const).map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-[var(--line)] bg-white p-4"
            >
              <p className="text-xs text-stone-500">{DUTY_LABELS[key]}</p>
              <div className="mt-2 space-y-1">
                {grouped[key].length === 0 ? (
                  <p className="text-sm text-stone-400">미정</p>
                ) : (
                  grouped[key].map((s) => (
                    <p key={s.id} className="font-medium">
                      {s.person_name}
                      {s.note ? (
                        <span className="ml-1 text-xs font-normal text-stone-500">
                          {s.note}
                        </span>
                      ) : null}
                    </p>
                  ))
                )}
              </div>
              <p className="mt-3 text-[11px] text-stone-400">{DUTY_SHORT[key]} 전용 표</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">공지사항</h2>
          <Link href="/notices" className="text-sm text-teal-800 hover:underline">
            전체
          </Link>
        </div>
        <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white">
          {(notices ?? []).length === 0 ? (
            <p className="p-5 text-sm text-stone-500">등록된 공지가 없습니다.</p>
          ) : (
            (notices as (Notice & { profiles: { name: string } | null })[]).map(
              (n) => (
                <Link key={n.id} href="/notices" className="block p-4 hover:bg-stone-50">
                  <div className="flex items-center gap-2">
                    {n.pinned ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                        고정
                      </span>
                    ) : null}
                    <p className="font-medium">{n.title}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{n.body}</p>
                </Link>
              ),
            )
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">바로가기</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/documents", title: "각종 문서양식", desc: "표준 문구 복사" },
            { href: "/consents", title: "수술동의 설명", desc: "설명 체크리스트" },
            { href: "/orders", title: "입원 오더", desc: "입원·퇴원·수혈" },
            { href: "/procedures", title: "술기·수술", desc: "기본 술기 정리" },
            { href: "/terms", title: "약어·용어", desc: "Urology terminology" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 hover:border-teal-700/40"
            >
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-stone-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
