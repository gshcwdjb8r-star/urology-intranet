import { createNotice, deleteNotice, toggleNoticePin, updateNotice } from "@/lib/actions/notices";
import { requireUser } from "@/lib/auth";
import { formatKoreanDateTime } from "@/lib/utils";

export default async function NoticesPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("notices")
    .select("*, profiles(name)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">공지사항</h1>
        <p className="mt-1 text-sm text-stone-600">과 내 일정, 프로토콜 변경, 인수인계 사항을 공유합니다.</p>
      </header>

      <form
        action={createNotice}
        className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-5"
      >
        <h2 className="font-medium">새 공지</h2>
        <input
          name="title"
          required
          placeholder="제목"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <textarea
          name="body"
          required
          rows={4}
          placeholder="내용"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pinned" className="accent-teal-800" />
          상단 고정
        </label>
        <button
          type="submit"
          className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
        >
          등록
        </button>
      </form>

      <ul className="space-y-4">
        {(data ?? []).map((n) => (
          <li
            key={n.id}
            className="rounded-2xl border border-[var(--line)] bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {n.pinned ? (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                      고정
                    </span>
                  ) : null}
                  <h2 className="text-lg font-semibold">{n.title}</h2>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  {(n.profiles as { name: string } | null)?.name ?? "작성자"} ·{" "}
                  {formatKoreanDateTime(n.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={toggleNoticePin}>
                  <input type="hidden" name="id" value={n.id} />
                  <input type="hidden" name="pinned" value={String(n.pinned)} />
                  <button type="submit" className="text-xs text-stone-500 hover:text-teal-800">
                    {n.pinned ? "고정 해제" : "고정"}
                  </button>
                </form>
                <form action={deleteNotice}>
                  <input type="hidden" name="id" value={n.id} />
                  <button type="submit" className="text-xs text-stone-400 hover:text-red-700">
                    삭제
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-700">{n.body}</p>
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-teal-800">수정</summary>
              <form action={updateNotice} className="mt-3 space-y-2">
                <input type="hidden" name="id" value={n.id} />
                <input name="title" required defaultValue={n.title} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <textarea name="body" required rows={4} defaultValue={n.body} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="pinned" defaultChecked={n.pinned} className="accent-teal-800" />
                  상단 고정
                </label>
                <button type="submit" className="rounded-lg bg-[var(--navy)] px-3 py-1.5 text-xs text-white">저장</button>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
