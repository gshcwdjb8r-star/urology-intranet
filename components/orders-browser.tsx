"use client";

import { useState } from "react";
import { deleteOrderSet, updateOrderSet } from "@/lib/actions/knowledge";
import { CopyButton } from "@/components/copy-button";
import type { OrderSet } from "@/lib/types";

export function OrdersBrowser({ orders }: { orders: OrderSet[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const cats = Array.from(new Set(orders.map((o) => o.category)));

  return (
    <>
      {cats.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 text-lg font-semibold text-[var(--navy)]">{cat}</h2>
          <div className="space-y-4">
            {orders
              .filter((o) => o.category === cat)
              .map((o) => (
                <article
                  key={o.id}
                  className="rounded-2xl border border-[var(--line)] bg-white p-5"
                >
                  {editingId === o.id ? (
                    <form action={updateOrderSet} className="space-y-3">
                      <input type="hidden" name="id" value={o.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input name="title" required defaultValue={o.title} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                        <input name="category" defaultValue={o.category} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      </div>
                      <textarea name="content" required rows={8} defaultValue={o.content} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-lg bg-[var(--navy)] px-3 py-1.5 text-xs text-white">저장</button>
                        <button type="button" className="text-xs text-stone-500" onClick={() => setEditingId(null)}>취소</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="font-medium">{o.title}</h3>
                        <div className="flex items-center gap-2">
                          <CopyButton text={o.content} />
                          <button type="button" className="text-xs text-teal-800" onClick={() => setEditingId(o.id)}>수정</button>
                          <form action={deleteOrderSet}>
                            <input type="hidden" name="id" value={o.id} />
                            <button type="submit" className="text-xs text-stone-400 hover:text-red-700">삭제</button>
                          </form>
                        </div>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
                        {o.content}
                      </pre>
                    </>
                  )}
                </article>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
