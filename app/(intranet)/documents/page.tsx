import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { DocumentTemplate, SavedDocument } from "@/lib/types";

export default async function DocumentsPage() {
  const { supabase } = await requireUser();
  const [{ data: templates }, { data: documents }] = await Promise.all([
    supabase.from("document_templates").select("*").order("category"),
    supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">문서 양식</h1>
        <p className="mt-1 text-sm text-stone-600">
          표준 항목을 입력해 저장하고 인쇄할 수 있습니다. 병원 공식 서식 제출 전 초안·내부
          정리용으로 사용하세요.
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-semibold">양식 선택</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {((templates ?? []) as DocumentTemplate[]).map((t) => (
            <Link
              key={t.id}
              href={`/documents/new?template=${t.id}`}
              className="rounded-2xl border border-[var(--line)] bg-white p-5 hover:border-teal-700/40"
            >
              <p className="text-xs text-teal-800">{t.category}</p>
              <p className="mt-1 font-medium">{t.title}</p>
              <p className="mt-2 text-sm text-stone-500">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">저장된 문서</h2>
        <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white">
          {((documents ?? []) as SavedDocument[]).length === 0 ? (
            <p className="p-5 text-sm text-stone-500">아직 저장된 문서가 없습니다.</p>
          ) : (
            ((documents ?? []) as SavedDocument[]).map((d) => (
              <Link
                key={d.id}
                href={`/documents/${d.id}`}
                className="flex items-center justify-between p-4 hover:bg-stone-50"
              >
                <span className="font-medium">{d.title}</span>
                <span className="text-xs text-stone-500">
                  {new Date(d.updated_at).toLocaleString("ko-KR")}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
