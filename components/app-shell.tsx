"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";
import { NAV_ITEMS } from "@/lib/constants";
import type { Profile } from "@/lib/types";

function NavIcon({ name }: { name: string }) {
  const cn = "h-[18px] w-[18px]";
  switch (name) {
    case "home":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4l8-1V7L4 10Zm8-3 7-3v14l-7-3M7 14v4" />
        </svg>
      );
    case "file":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a2 2 0 0 1 2 2v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2Zm0 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8 11h8M8 15h5" />
        </svg>
      );
    case "book":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm4 3h7M8 12h7" />
        </svg>
      );
    case "activity":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2.5 7L14 5l2.5 7H21" />
        </svg>
      );
    case "pill":
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5 15.5 8.5m-9.2 2.1a4.5 4.5 0 1 1 6.36-6.36l7.1 7.1a4.5 4.5 0 1 1-6.36 6.36l-7.1-7.1Z" />
        </svg>
      );
    default:
      return (
        <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
  }
}

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full bg-[var(--paper)]">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[var(--navy)] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-[11px] tracking-[0.18em] text-teal-200/80 uppercase">
            St. Vincent&apos;s Hospital
          </p>
          <h1 className="mt-1 text-lg font-semibold leading-snug">성빈센트병원 비뇨의학과</h1>
          <p className="mt-1 text-xs text-white/55">인트라넷</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium">{profile.name}</p>
          <p className="mt-0.5 text-xs text-teal-200/90">{profile.role}</p>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="text-xs text-white/55 underline-offset-2 hover:text-white hover:underline"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <header className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          className="rounded-md border border-[var(--line)] px-2.5 py-1.5 text-sm"
          onClick={() => setOpen(true)}
        >
          메뉴
        </button>
        <p className="text-sm font-semibold">성빈센트병원 비뇨의학과</p>
        <span className="rounded-full bg-teal-700/10 px-2 py-0.5 text-xs text-teal-800">
          {profile.role}
        </span>
      </header>

      {open ? (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-[var(--navy)] p-3 text-white">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-white/85 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
