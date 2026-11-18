import { differenceInCalendarDays, format } from "date-fns";

/** Format a YYYY-MM-DD string as e.g. "Fri, 20 Nov 2026". */
export function formatDate(dateStr: string): string {
  return format(new Date(`${dateStr}T00:00:00`), "EEE, d MMM yyyy");
}

/** Short format: "20 Nov 2026". */
export function formatDateShort(dateStr: string): string {
  return format(new Date(`${dateStr}T00:00:00`), "d MMM yyyy");
}

export type DueTone = "overdue" | "soon" | "later";

/** Human-friendly label for a vaccination due date. */
export function dueInfo(
  dateStr: string,
  today: string
): { label: string; tone: DueTone; days: number } {
  const days = differenceInCalendarDays(
    new Date(`${dateStr}T00:00:00`),
    new Date(`${today}T00:00:00`)
  );
  if (days < 0) {
    return {
      label: `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`,
      tone: "overdue",
      days,
    };
  }
  if (days === 0) return { label: "Due today", tone: "soon", days };
  if (days <= 7) {
    return {
      label: `Due in ${days} day${days === 1 ? "" : "s"}`,
      tone: "soon",
      days,
    };
  }
  return { label: `Due ${formatDateShort(dateStr)}`, tone: "later", days };
}
