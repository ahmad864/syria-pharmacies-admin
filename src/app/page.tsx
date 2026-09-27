import { redirect } from "next/navigation";

/**
 * Always points at /dashboard — real auth gating now happens in
 * `middleware.ts`, which redirects to /login before this page ever
 * renders if there's no session cookie.
 */
export default function RootPage() {
  redirect("/dashboard");
}
