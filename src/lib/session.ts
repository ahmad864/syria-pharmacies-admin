"use client";

/**
 * Session token storage.
 *
 * Stored as a regular (non-httpOnly) cookie rather than localStorage for
 * two concrete reasons:
 *   1. Next.js `middleware.ts` (route protection) runs in the Edge
 *      runtime and can only read cookies from the incoming request — it
 *      cannot access localStorage at all, so a cookie is required for
 *      the "no direct access to /dashboard without login" requirement.
 *   2. Cookies support `SameSite`/`Secure`/`Max-Age` attributes that
 *      localStorage has no equivalent for.
 *
 * Documented trade-off: this is NOT an httpOnly cookie, so it is
 * readable by JavaScript (same practical XSS exposure as localStorage).
 * A hardened follow-up would move all API calls behind Next.js Route
 * Handlers that hold the token in a true httpOnly cookie server-side —
 * out of scope for this pass but noted in the final report.
 */
const COOKIE_NAME = "admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function setSessionToken(token: string): void {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

export function clearSessionToken(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
