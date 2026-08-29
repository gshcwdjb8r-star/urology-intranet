import { LoginForm } from "@/components/login-form";
import { isSupabaseConfigured } from "@/lib/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.2em] text-teal-800 uppercase">St. Vincent&apos;s Hospital</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">성빈센트병원 비뇨의학과</h1>
          <p className="mt-2 text-sm text-stone-600">인트라넷 · 스텝 · 전담간호사 공용</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <LoginForm nextPath={next ?? "/"} configured={isSupabaseConfigured()} />
        </div>
      </div>
    </div>
  );
}
