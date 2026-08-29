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
          양식을 골라 내용을 입력한 뒤 저장·인쇄할 수 있습니다. 작성 요령과 문장 예는 입력
          화면 아래에 있습니다. 병원 공식 문서를 대체하지 않습니다.
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
                {t.description ?? extra?.purpose}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
