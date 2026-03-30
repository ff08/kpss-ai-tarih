import type { ExamRecord } from "../constants/exams";

/** Sınav günü sabahı (yerel) — geri sayım hedefi */
export function examTargetDate(dateStr: string): Date {
  const ymd = dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 9, 0, 0, 0);
}

export function formatTrDate(dateStr: string): string {
  const ymd = dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
  const [y, m, d] = ymd.split("-").map(Number);
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
};

export function getCountdownTo(target: Date, now: Date): CountdownParts {
  const totalMs = target.getTime() - now.getTime();
  if (totalMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const secs = Math.floor(totalMs / 1000);
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  return { totalMs, days, hours, minutes, seconds, passed: false };
}

/** Takip edilen (aktif) ve tarihi gelmemiş sınavlar arasından en yakını */
export function nextUpcomingExam(
  exams: ExamRecord[],
  prefs: Record<string, boolean>,
  now: Date,
): ExamRecord | null {
  const active = exams.filter((e) => prefs[e.id] !== false);
  const future = active
    .map((e) => ({ e, t: examTargetDate(e.date) }))
    .filter(({ t }) => t.getTime() > now.getTime())
    .sort((a, b) => a.t.getTime() - b.t.getTime());
  return future[0]?.e ?? null;
}
