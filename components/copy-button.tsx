"use client";

import { useState } from "react";

async function copyPlainText(value: string) {
  const text = value ?? "";
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* fallback below */
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.focus();
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await copyPlainText(text);
        window.getSelection()?.removeAllRanges();
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "복사됨" : label}
    </button>
  );
}
