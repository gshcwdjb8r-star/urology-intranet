import { DocumentsStudio } from "@/components/documents-studio";
import { requireUser } from "@/lib/auth";
import { resolveTemplates } from "@/lib/document-guides";
import type { DocumentTemplate } from "@/lib/types";

export default async function DocumentsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("document_templates").select("*").order("category");
  const templates = resolveTemplates((data ?? []) as DocumentTemplate[]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">각종 문서양식</h1>
        <p className="mt-1 text-sm text-stone-600">
          왼쪽에서 양식을 고르면 바로 입력할 수 있습니다. 저장하면 인쇄 화면으로 이동합니다.
        </p>
      </header>
      <DocumentsStudio templates={templates} />
    </div>
  );
}
