"use client";

import { useMemo, useState } from "react";
import { addSnippet, deleteSnippet, saveSnippet } from "@/lib/actions/documents";
import { CopyButton } from "@/components/copy-button";
import { SNIPPET_CATEGORIES, type Snippet } from "@/lib/snippets";

function CategorySelect({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  return (
    <select
      name={name}
      required
      defaultValue={defaultValue ?? "진단서"}
      className="w-full rounded-lg border border-stone-300 px-3 py-2"
    >
      {SNIPPET_CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

export function SnippetBrowser({ snippets }: { snippets: Snippet[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const [openId, setOpenId] = useState<string | null>(snippets[0]?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const filters = ["전체", ...SNIPPET_CATEGORIES];

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return snippets.filter((s) => {
      if (cat !== "전체" && s.category !== cat) return false;
      if (!n) return true;
      return [s.category, s.title, s.body].some((v) => v.toLowerCase().includes(n));
    });
  }, [snippets, q, cat]);

  const grouped = useMemo(() => {
    return SNIPPET_CATEGORIES.map((category) => ({
      category,
      items: filtered.filter((s) => s.category === category),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="제목·내용 검색"
          className="min-w-48 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
        >
          {adding ? "닫기" : "문구 추가"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs ${
              cat === c ? "bg-[var(--navy)] text-white" : "bg-white border border-[var(--line)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {adding ? (
        <form action={addSnippet} className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">카테고리</span>
              <CategorySelect name="category" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">제목</span>
              <input
                name="title"
                required
                placeholder="찾기 쉬운 짧은 제목"
                className="w-full rounded-lg border border-stone-300 px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">내용</span>
            <textarea
              name="body"
              required
              rows={8}
              placeholder="복사해서 EMR에 붙여 넣을 표준 문구"
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
          >
            저장
          </button>
        </form>
      ) : null}

      {grouped.length === 0 ? (
        <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-stone-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        grouped.map(({ category, items }) => (
          <section key={category}>
            <h2 className="mb-2 text-sm font-semibold text-stone-500">{category}</h2>
            <div className="space-y-2">
              {items.map((s) => {
                const open = openId === s.id;
                const editing = editingId === s.id;
                return (
                  <article
                    key={s.id}
                    className="rounded-2xl border border-[var(--line)] bg-white"
                  >
                    <div className="flex select-none items-center gap-2 px-3 py-2.5">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setOpenId(open ? null : s.id);
                          setEditingId(null);
                        }}
                      >
                        <span className="font-medium">{s.title}</span>
                      </button>
                      <CopyButton text={s.body} label="복사" />
                      <button
                        type="button"
                        className="text-xs text-teal-800"
                        onClick={() => {
                          setOpenId(s.id);
                          setEditingId(editing ? null : s.id);
                        }}
                      >
                        수정
                      </button>

                    </div>
                    {editing ? (
                      <form action={saveSnippet} className="space-y-3 border-t border-[var(--line)] px-4 py-3">
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="source_id" value={s.sourceId ?? (s.id.startsWith("default-") ? s.id : "")} />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm">
                            <span className="mb-1 block text-stone-600">카테고리</span>
                            <CategorySelect name="category" defaultValue={s.category} />
                          </label>
                          <label className="block text-sm">
                            <span className="mb-1 block text-stone-600">제목</span>
                            <input
                              name="title"
                              required
                              defaultValue={s.title}
                              className="w-full rounded-lg border border-stone-300 px-3 py-2"
                            />
                          </label>
                        </div>
                        <textarea
                          name="body"
                          required
                          rows={10}
                          defaultValue={s.body}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            className="text-sm text-stone-400 hover:text-red-700"
                            onClick={async () => {
                              if (!confirm("정말 삭제하시겠습니까?")) return;
                              const fd = new FormData();
                              fd.append("id", s.id);
                              fd.append("source_id", s.sourceId ?? (s.id.startsWith("default-") ? s.id : ""));
                              await deleteSnippet(fd);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </form>
                    ) : open ? (
                      <pre className="select-text border-t border-[var(--line)] whitespace-pre-wrap px-4 py-3 font-sans text-sm leading-7 text-stone-700">
                        {s.body}
                      </pre>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
