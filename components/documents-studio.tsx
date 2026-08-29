"use client";

import { useState } from "react";
import { DocumentForm } from "@/components/document-form";
import { CopyButton } from "@/components/copy-button";
import { guideForTitle } from "@/lib/document-guides";
import type { DocumentTemplate } from "@/lib/types";

export function DocumentsStudio({ templates }: { templates: DocumentTemplate[] }) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? "");
  const template = templates.find((t) => t.id === selectedId) ?? templates[0];

  if (!template) {
    return <p className="text-sm text-stone-500">표시할 양식이 없습니다.</p>;
  }

  const extra = guideForTitle(template.title);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="space-y-1">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedId(t.id)}
            className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
              t.id === template.id
                ? "bg-[var(--navy)] text-white"
                : "bg-white border border-[var(--line)] hover:border-teal-700/40"
            }`}
          >
            <span className="block text-[11px] opacity-70">{t.category}</span>
            {t.title}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        <div>
          <p className="text-xs text-teal-800">{template.category}</p>
          <h2 className="text-xl font-semibold text-[var(--navy)]">{template.title} 작성</h2>
          {extra ? (
            <p className="mt-2 text-sm leading-7 text-stone-600">{extra.purpose}</p>
          ) : null}
        </div>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <DocumentForm key={template.id} template={template} />
        </section>

        {extra?.tips?.length ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h3 className="font-semibold">작성 요령</h3>
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
              <h3 className="font-semibold">문장 예 (참고)</h3>
              <CopyButton text={extra.sample} label="예시 복사" />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
              {extra.sample}
            </pre>
          </section>
        ) : null}
      </div>
    </div>
  );
}
