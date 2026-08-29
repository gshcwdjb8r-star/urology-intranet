import { SnippetBrowser } from "@/components/snippet-browser";
import { requireUser } from "@/lib/auth";
import { isSnippetData, mergeSnippets, type Snippet } from "@/lib/snippets";

export default async function DocumentsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("documents")
    .select("id, title, data")
    .order("created_at", { ascending: false });

  const dbSnippets: Snippet[] = (data ?? [])
    .filter((row) => isSnippetData(row.data))
    .map((row) => {
      const d = row.data as { category: string; body: string; sourceId?: string };
      return {
        id: row.id,
        title: row.title,
        category: d.category,
        body: d.body,
        sourceId: d.sourceId,
      };
    });

  const snippets = mergeSnippets(dbSnippets);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">문서 참고 문구</h1>
        <p className="mt-1 text-sm text-stone-600">
          카테고리를 선택하거나 검색해서 문구를 찾고, 복사해서 EMR에 붙여 넣으세요.
        </p>
      </header>
      <SnippetBrowser snippets={snippets} />
    </div>
  );
}
