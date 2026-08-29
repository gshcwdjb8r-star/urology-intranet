"use client";

import { useRouter } from "next/navigation";

export function PrintButton() {
  const router = useRouter();
  return (
    <div className="no-print flex gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
      >
        인쇄
      </button>
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm"
      >
        뒤로
      </button>
    </div>
  );
}
