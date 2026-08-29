import { SnippetBrowser } from "@/components/snippet-browser";
import { requireUser } from "@/lib/auth";
import { DEFAULT_SNIPPETS, isSnippetData, type Snippet } from "@/lib/snippets";

export default async function DocumentsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("documents")
    .select("id, title, data")
    .order("created_at", { ascending: false });

  const custom: Snippet[] = (data ?? [])
    .filter((row) => isSnippetData(row.data))
    .map((row) => ({
      id: row.id,
      title: row.title,
      category: (row.data as { category: string }).category,
      body: (row.data as { body: string }).body,
    }));

  const snippets = [...DEFAULT_SNIPPETS, ...custom];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">각종 문서양식</h1>
        <p className="mt-1 text-sm text-stone-600">
          EMR에 붙여 넣을 표준 문구입니다. 제목을 눌러 펼치고 복사하세요. 공식 진단서는 병원
          EMR에서 작성합니다.
        </p>
      </header>
      <SnippetBrowser snippets={snippets} />
    </div>
  );
}
