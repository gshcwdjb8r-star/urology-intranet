import Link from "next/link";
import { DUTY_LABELS } from "@/lib/constants";
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
        <p className="text-2xl font-semibold text-[var(--navy)]">{formatKoreanDate(today)}</p>
        <h1 className="mt-1 text-sm font-normal text-stone-600">
          {profile.name} 님, 안녕하세요
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          직위: <span className="font-medium text-teal-800">{profile.role}</span>
        </p>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">오늘 당직</h2>
          <Link href="/duty" className="text-sm text-teal-800 hover:underline">
            캘린더 보기
          </Link>
        </div>
        <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white">
          {(["staff", "trainee", "nurse"] as const).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <p className="w-36 shrink-0 text-sm text-stone-500">{DUTY_LABELS[key]}</p>
              <div className="min-w-0 flex-1 space-y-0.5">
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
            { href: "/medications", title: "약품", desc: "비뇨의학과 사용 약품" },
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
