"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useTransition } from "react";

export function SearchInput({ placeholder = "검색..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
      />
      <button
        type="button"
        onClick={submit}
        className="shrink-0 whitespace-nowrap rounded-xl bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white"
      >
        검색
      </button>
    </div>
  );
}
