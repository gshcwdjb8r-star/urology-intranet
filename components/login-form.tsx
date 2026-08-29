"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "@/lib/actions/auth";
import { ROLES } from "@/lib/constants";

export function LoginForm({
  nextPath,
  configured,
}: {
  nextPath: string;
  configured: boolean;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState<AuthState, FormData>(
    login,
    undefined,
  );
  const [signupState, signupAction, signupPending] = useActionState<AuthState, FormData>(
    signup,
    undefined,
  );

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-semibold">Supabase 연결이 필요합니다.</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Supabase 프로젝트를 만들고 Authentication을 켭니다.</li>
          <li>
            SQL Editor에서 <code className="rounded bg-white px-1">supabase/schema.sql</code>과{" "}
            <code className="rounded bg-white px-1">supabase/seed.sql</code>을 실행합니다.
          </li>
          <li>
            프로젝트 루트에 <code className="rounded bg-white px-1">.env.local</code>을 만들고
            URL과 anon key를 넣습니다.
          </li>
        </ol>
      </div>
    );
  }

  const pending = mode === "login" ? loginPending : signupPending;
  const error = mode === "login" ? loginState?.error : signupState?.error;

  return (
    <div>
      <div className="mb-6 flex rounded-lg bg-stone-100 p-1 text-sm">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 ${mode === "login" ? "bg-white font-medium shadow-sm" : "text-stone-500"}`}
          onClick={() => setMode("login")}
        >
          로그인
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 ${mode === "signup" ? "bg-white font-medium shadow-sm" : "text-stone-500"}`}
          onClick={() => setMode("signup")}
        >
          계정 만들기
        </button>
      </div>

      <form action={mode === "login" ? loginAction : signupAction} className="space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        {mode === "signup" ? (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">이름</span>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-teal-700"
                placeholder="홍길동"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">역할 (표시용)</span>
              <select
                name="role"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-teal-700"
                defaultValue="스텝"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-stone-500">
                역할은 화면에 표시되며, 메뉴 접근 권한은 모두 같습니다.
              </span>
            </label>
          </>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1 block font-medium">이메일</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-teal-700"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">비밀번호</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-teal-700"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[var(--navy)] py-2.5 text-sm font-medium text-white hover:bg-[var(--navy-mid)] disabled:opacity-60"
        >
          {pending ? "처리 중…" : mode === "login" ? "로그인" : "계정 만들기"}
        </button>
      </form>
    </div>
  );
}
