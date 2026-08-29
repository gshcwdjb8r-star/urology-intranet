import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDocument } from "@/lib/actions/documents";
import { DocumentForm } from "@/components/document-form";
import { PrintButton } from "@/components/print-button";
import { requireUser } from "@/lib/auth";
import type { DocumentTemplate, SavedDocument, TemplateField } from "@/lib/types";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data: doc } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) notFound();
  const document = doc as SavedDocument;

  let template: DocumentTemplate | null = null;
  if (document.template_id) {
    const { data } = await supabase
      .from("document_templates")
      .select("*")
      .eq("id", document.template_id)
      .maybeSingle();
    template = data as DocumentTemplate | null;
  }

  const fields: TemplateField[] = template?.fields ?? [];

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/documents" className="text-sm text-teal-800 hover:underline">
            문서 목록
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--navy)]">{document.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <PrintButton />
          <form action={deleteDocument}>
            <input type="hidden" name="id" value={document.id} />
            <button type="submit" className="text-sm text-red-700">
              삭제
            </button>
          </form>
        </div>
      </div>

      <article className="print-sheet rounded-2xl border border-[var(--line)] bg-white p-8">
        <div className="print-only mb-8 text-center">
          <p className="text-sm tracking-widest text-stone-500">비뇨의학과</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {template?.title ?? "문서"}
          </h2>
        </div>
        <dl className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-1 border-b border-dashed border-stone-200 pb-3 sm:grid-cols-[160px_1fr]">
              <dt className="text-sm text-stone-500">{field.label}</dt>
              <dd className="whitespace-pre-wrap text-sm leading-6">
                {document.data?.[field.name] || "—"}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-right text-sm text-stone-500">
          작성일 {new Date(document.created_at).toLocaleDateString("ko-KR")}
        </p>
      </article>

      {template ? (
        <section className="no-print mx-auto max-w-2xl rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="mb-4 font-semibold">수정</h2>
          <DocumentForm template={template} document={document} />
        </section>
      ) : null}
    </div>
  );
}
