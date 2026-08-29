"use client";

import { deleteProcedure } from "@/lib/actions/procedures";

export function DeleteButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="text-xs text-stone-400 hover:text-red-700"
      onClick={async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const fd = new FormData();
        fd.append("id", id);
        await deleteProcedure(fd);
      }}
    >
      삭제
    </button>
  );
}
