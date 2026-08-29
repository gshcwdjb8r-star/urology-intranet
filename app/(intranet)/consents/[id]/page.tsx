import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteConsentGuide, updateConsentGuide } from "@/lib/actions/knowledge";
import { ConsentChecklist } from "@/components/consent-checklist";
import { requireUser } from "@/lib/auth";
import type { ConsentGuide } from "@/lib/types";

export default async function ConsentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("consent_guides")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const guide = data as ConsentGuide;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href="/consents" className="text-sm text-teal-800 hover:underline">
            목록
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
            {guide.surgery_name}
          </h1>
          {guide.summary ? (
            <p className="mt-2 text-sm leading-7 text-stone-600">{guide.summary}</p>
          ) : null}
        </div>
        <form action={deleteConsentGuide}>
          <input type="hidden" name="id" value={guide.id} />
          <input type="hidden" name="from" value="detail" />
          <button type="submit" className="text-sm text-red-700">삭제</button>
        </form>
      </div>
      <ConsentChecklist guide={guide} />
      {guide.notes ? (
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-medium">집도의 참고</p>
          <p className="mt-1">{guide.notes}</p>
        </aside>
      ) : null}

      <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-5">
        <h2 className="mb-3 font-medium">수정</h2>
        <form action={updateConsentGuide} className="space-y-3">
          <input type="hidden" name="id" value={guide.id} />
          <input name="surgery_name" required defaultValue={guide.surgery_name} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <input name="summary" defaultValue={guide.summary ?? ""} placeholder="요약" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <textarea
            name="items"
            required
            rows={8}
            defaultValue={(guide.items ?? []).map((i) => `${i.title}: ${i.text}`).join("\n")}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <textarea name="notes" rows={2} defaultValue={guide.notes ?? ""} placeholder="집도의 참고" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">저장</button>
        </form>
      </section>
    </div>
  );
}
