import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProcedure, updateProcedure } from "@/lib/actions/knowledge";
import { requireUser } from "@/lib/auth";
import type { Procedure } from "@/lib/types";

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data } = await supabase.from("procedures").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const procedure = data as Procedure;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/procedures" className="text-sm text-teal-800 hover:underline">
        목록
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-teal-800">{procedure.category}</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--navy)]">{procedure.title}</h1>
        </div>
        <form action={deleteProcedure}>
          <input type="hidden" name="id" value={procedure.id} />
          <input type="hidden" name="from" value="detail" />
          <button type="submit" className="text-sm text-red-700">삭제</button>
        </form>
      </div>
      {procedure.indication ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="text-sm font-medium text-stone-500">적응</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{procedure.indication}</p>
        </section>
      ) : null}
      <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-sm font-medium text-stone-500">내용</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{procedure.content}</p>
      </section>
      {procedure.complications ? (
        <section className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <h2 className="text-sm font-medium text-red-800">합병증 · 주의</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-red-950">
            {procedure.complications}
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-5">
        <h2 className="mb-3 font-medium">수정</h2>
        <form action={updateProcedure} className="space-y-3">
          <input type="hidden" name="id" value={procedure.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="title" required defaultValue={procedure.title} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <select name="category" defaultValue={procedure.category} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
              <option value="술기">술기</option>
              <option value="수술">수술</option>
            </select>
          </div>
          <input name="indication" defaultValue={procedure.indication ?? ""} placeholder="적응" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <textarea name="content" required rows={8} defaultValue={procedure.content} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <input name="complications" defaultValue={procedure.complications ?? ""} placeholder="합병증" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">저장</button>
        </form>
      </section>
    </article>
  );
}
