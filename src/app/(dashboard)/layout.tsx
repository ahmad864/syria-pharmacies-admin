"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * `middleware.ts` already blocks token-less requests before this ever
 * renders — this loading gate handles the remaining case: a token cookie
 * exists but AuthProvider's `GET /admin/auth/me` hasn't resolved yet (or
 * resolves to "invalid", in which case it redirects to /login itself).
 * Renders nothing but a full-screen spinner rather than a flash of
 * dashboard chrome before that resolves.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:ms-[260px]">
        <Header />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
