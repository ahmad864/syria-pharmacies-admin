import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_token";
const PUBLIC_PATHS = ["/login"];

/**
 * Real route protection (brief section 3: "منع الوصول المباشر للـ Dashboard
 * بدون Login"). Runs on the Edge before any page renders — cannot access
 * localStorage, which is exactly why the session token is stored in a
 * cookie (see src/lib/session.ts). This only checks that a token
 * *exists*; it cannot verify the token is still valid server-side (Edge
 * middleware can't call the Laravel API without adding real latency to
 * every navigation) — actual validity is confirmed by AuthProvider on
 * mount via `GET /admin/auth/me`, which redirects to /login itself if
 * the token has expired/been revoked. This middleware's job is narrower
 * and cheaper: block outright token-less access.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has(SESSION_COOKIE_NAME);

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isPublic && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every route except static assets/Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
