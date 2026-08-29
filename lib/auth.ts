import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export async function requireUser() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile: (profile as Profile | null) ?? {
      id: user.id,
      name: (user.user_metadata?.name as string | undefined) ?? "사용자",
      role: (user.user_metadata?.role as string | undefined) ?? "스텝",
      created_at: user.created_at,
    },
    supabase,
  };
}
