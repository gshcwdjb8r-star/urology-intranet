import { addOrderSet } from "@/lib/actions/knowledge";
import { CopyButton } from "@/components/copy-button";
import { requireUser } from "@/lib/auth";
import type { OrderSet } from "@/lib/types";

export default async function OrdersPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("order_sets").select("*").order("sort_order");
  const orders = (data ?? []) as OrderSet[];
  const cats = Array.from(new Set(orders.map((o) => o.category)));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">입원 중 기본 오더</h1>
        <p className="mt-1 text-sm text-stone-600">
          입원, 수술 후, 퇴원, 수혈, 응급 상황의 기본 오더 뼈대입니다. EMR에 붙여 넣은 뒤
          환자별로 수정하세요.
        </p>
      </header>

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
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-medium">{o.title}</h3>
                    <CopyButton text={o.content} />
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
                    {o.content}
                  </pre>
                </article>
              ))}
          </div>
        </section>
      ))}

      <form action={addOrderSet} className="space-y-3 rounded-2xl border border-dashed border-stone-300 bg-white p-5">
        <h2 className="font-medium">오더셋 추가</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="제목" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <input name="category" placeholder="분류 (입원, 퇴원, 수혈 등)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        </div>
        <textarea name="content" required rows={8} placeholder="오더 내용" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
          추가
        </button>
      </form>
    </div>
  );
}
