import type { DocumentTemplate, SavedDocument } from "@/lib/types";
import { saveDocument } from "@/lib/actions/documents";

export function DocumentForm({
  template,
  document,
}: {
  template: DocumentTemplate;
  document?: SavedDocument;
}) {
  return (
    <form action={saveDocument} className="space-y-4">
      <input type="hidden" name="template_id" value={template.id} />
      {document ? <input type="hidden" name="id" value={document.id} /> : null}
      {template.fields.map((field) => {
        const value = document?.data?.[field.name] ?? "";
        const cls =
          "w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-teal-700";
        return (
          <label key={field.name} className="block text-sm">
            <span className="mb-1 block font-medium">
              {field.label}
              {field.required ? <span className="text-red-600"> *</span> : null}
            </span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                defaultValue={value}
                rows={4}
                className={cls}
              />
            ) : (
              <input
                name={field.name}
                type={field.type === "date" ? "date" : "text"}
                required={field.required}
                defaultValue={value}
                className={cls}
              />
            )}
          </label>
        );
      })}
      <button
        type="submit"
        className="rounded-lg bg-[var(--navy)] px-5 py-2.5 text-sm font-medium text-white"
      >
        저장
      </button>
    </form>
  );
}
