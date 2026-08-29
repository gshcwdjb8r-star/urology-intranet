import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { guideForTitle } from "@/lib/document-guides";
import type { DocumentTemplate } from "@/lib/types";

export default async function DocumentsPage() {
  const { supabase } = await requireUser();
  const { data: templates } = await supabase
    .from("document_templates")
    .select("*")
    .order("category");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">각종 문서양식</h1>
        <p className="mt-1 text-sm text-stone-600">
          진단서, 소견서 등을 EMR·원무 공식 서식에 작성할 때 확인할 항목과 문장 예입니다.
          병원 공식 문서를 대체하지 않습니다.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {((templates ?? []) as DocumentTemplate[]).map((t) => {
          const extra = guideForTitle(t.title);
          return (
            <Link
              key={t.id}
              href={`/documents/${t.id}`}
              className="rounded-2xl border border-[var(--line)] bg-white p-5 hover:border-teal-700/40"
            >
              <p className="text-xs text-teal-800">{t.category}</p>
              <p className="mt-1 font-medium">{t.title}</p>
              <p className="mt-2 text-sm text-stone-500">
                {extra?.purpose ?? t.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
