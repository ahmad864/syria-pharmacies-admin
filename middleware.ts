import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_token";
const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has(SESSION_COOKIE_NAME);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isPublic && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  if (pathname === "/login" && hasToken) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
