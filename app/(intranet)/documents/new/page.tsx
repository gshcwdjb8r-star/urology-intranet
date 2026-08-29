import { notFound } from "next/navigation";
import { DocumentForm } from "@/components/document-form";
import { requireUser } from "@/lib/auth";
import type { DocumentTemplate } from "@/lib/types";

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateId } = await searchParams;
  if (!templateId) notFound();
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("document_templates")
    .select("*")
    .eq("id", templateId)
    .maybeSingle();
  if (!data) notFound();
  const template = data as DocumentTemplate;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs text-teal-800">{template.category}</p>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">{template.title}</h1>
        {template.description ? (
          <p className="mt-1 text-sm text-stone-600">{template.description}</p>
        ) : null}
      </header>
      <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <DocumentForm template={template} />
      </div>
    </div>
  );
}
