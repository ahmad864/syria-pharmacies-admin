"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

/**
 * Central toast host, mounted once in the root layout. Call `toast.success(...)`
 * / `toast.error(...)` (re-exported from `sonner`) anywhere — used for save /
 * delete / approve / reject / update / logout confirmations across the app.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-center"
      dir="rtl"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-surface-border bg-surface-raised text-ink shadow-popover font-sans",
          title: "font-semibold",
        },
      }}
    />
  );
}
