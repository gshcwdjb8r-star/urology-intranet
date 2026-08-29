export const DUTY_LABELS: Record<"staff" | "trainee" | "nurse", string> = {
  staff: "스텝 당직",
  trainee: "인턴·레지던트 당직",
  nurse: "전담간호사 당직",
};

export const DUTY_SHORT: Record<"staff" | "trainee" | "nurse", string> = {
  staff: "스텝",
  trainee: "전공의/인턴",
  nurse: "전담간호사",
};

export const ROLES = ["스텝", "전담간호사", "전공의", "인턴", "기타"] as const;

export const NAV_ITEMS = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/duty", label: "당직표", icon: "calendar" },
  { href: "/notices", label: "공지사항", icon: "megaphone" },
  { href: "/documents", label: "문서 양식", icon: "file" },
  { href: "/consents", label: "수술동의 설명", icon: "clipboard" },
  { href: "/terms", label: "약어·용어", icon: "book" },
  { href: "/procedures", label: "술기·수술", icon: "activity" },
  { href: "/medications", label: "약품", icon: "pill" },
  { href: "/orders", label: "입원 오더", icon: "list" },
] as const;
