import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { DocumentForm } from "@/components/document-form";
import { requireUser } from "@/lib/auth";
import { FALLBACK_TEMPLATES, guideForTitle, parseTemplateFields } from "@/lib/document-guides";
import type { DocumentTemplate } from "@/lib/types";

export default async function DocumentGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("document_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const fallback = FALLBACK_TEMPLATES.find((t) => t.id === id);
  if (!data && !fallback) notFound();
  const template = (data as DocumentTemplate | null)
    ? {
        ...(data as DocumentTemplate),
        fields:
          parseTemplateFields((data as DocumentTemplate).fields).length > 0
            ? parseTemplateFields((data as DocumentTemplate).fields)
            : (FALLBACK_TEMPLATES.find((t) => t.title === (data as DocumentTemplate).title)
                ?.fields ?? []),
      }
    : fallback!;
  if (!template.fields.length) notFound();
  const extra = guideForTitle(template.title);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/documents" className="text-sm text-teal-800 hover:underline">
            각종 문서양식
          </Link>
          <p className="mt-2 text-xs text-teal-800">{template.category}</p>
          <h1 className="text-2xl font-semibold text-[var(--navy)]">{template.title}</h1>
        </div>
      </div>

      {extra ? (
        <p className="text-sm leading-7 text-stone-600">{extra.purpose}</p>
      ) : template.description ? (
        <p className="text-sm leading-7 text-stone-600">{template.description}</p>
      ) : null}

      <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="mb-4 font-semibold">작성</h2>
        <DocumentForm template={template} />
      </section>

      {extra?.tips?.length ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold">작성 요령</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-stone-700">
            {extra.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {extra?.sample ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold">문장 예 (참고)</h2>
            <CopyButton text={extra.sample} label="예시 복사" />
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
            {extra.sample}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
