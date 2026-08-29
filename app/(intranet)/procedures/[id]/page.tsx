import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div>
        <p className="text-xs text-teal-800">{procedure.category}</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--navy)]">{procedure.title}</h1>
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
    </article>
  );
}
