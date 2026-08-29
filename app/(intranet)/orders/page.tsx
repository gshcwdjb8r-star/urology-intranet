import { OrdersBrowser } from "@/components/orders-browser";
import { addOrderSet } from "@/lib/actions/knowledge";
import { requireUser } from "@/lib/auth";
import type { OrderSet } from "@/lib/types";

export default async function OrdersPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("order_sets").select("*").order("sort_order");
  const orders = (data ?? []) as OrderSet[];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">입원 중 기본 오더</h1>
        <p className="mt-1 text-sm text-stone-600">
          입원, 수술 후, 퇴원, 수혈, 응급 상황의 기본 오더 뼈대입니다. EMR에 붙여 넣은 뒤
          환자별로 수정하세요.
        </p>
      </header>

      <OrdersBrowser orders={orders} />

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
