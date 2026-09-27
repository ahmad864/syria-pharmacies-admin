import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists safely (later classes win over conflicting earlier ones). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Arabic-locale number formatting used across stat cards and tables. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-SY").format(value);
}

/** Formats an ISO date string as a readable Arabic date (e.g. "٢٤ أغسطس ٢٠٢٦"). */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ar-SY", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

/** Formats an ISO date string with time (e.g. "٢٤ أغسطس، ١٠:٣٠ ص"). */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ar-SY", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Converts "14:30" -> "٢:٣٠ م", matching the Flutter app's time display convention. */
export function formatTime12(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? "م" : "ص";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Simulates network latency for mock service calls so loading states are visible in the UI. */
export function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
