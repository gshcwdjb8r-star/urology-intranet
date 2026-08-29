import Link from "next/link";
import { notFound } from "next/navigation";
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
      <ConsentChecklist guide={guide} />
      {guide.notes ? (
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-medium">집도의 참고</p>
          <p className="mt-1">{guide.notes}</p>
        </aside>
      ) : null}
    </div>
  );
}
