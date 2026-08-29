"use client";

import { useState } from "react";

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "복사됨" : label}
    </button>
  );
}
