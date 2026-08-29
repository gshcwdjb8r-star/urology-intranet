"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export function SearchInput({ placeholder = "검색..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  return (
    <input
      type="search"
      defaultValue={searchParams.get("q") ?? ""}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
      onChange={(e) => {
        const q = e.target.value.trim();
        const params = new URLSearchParams(searchParams.toString());
        if (q) params.set("q", q);
        else params.delete("q");
        startTransition(() => router.replace(`${pathname}?${params.toString()}`));
      }}
    />
  );
}
