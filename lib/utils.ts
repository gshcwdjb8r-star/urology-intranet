export const SEOUL_TZ = "Asia/Seoul";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Calendar date in Korea (UTC+9, no DST). Does not depend on the server clock timezone. */
export function toDateKey(date: Date = new Date()) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export function parseDateKey(key: string) {
  return new Date(`${key.slice(0, 10)}T12:00:00+09:00`);
}

export function shiftDateKey(key: string, months: number) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1 + months, d ?? 1)).toISOString().slice(0, 10);
}

export function formatKoreanDate(iso: string) {
  const key = iso.slice(0, 10);
  const [y, m, d] = key.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][parseDateKey(key).getUTCDay()];
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

export function formatKoreanDateTime(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    cells.push(day);
  }
  return cells;
}
