"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, Bell, ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { MobileSidebar } from "./MobileSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0]!.slice(0, 1);
  return `${parts[0]!.slice(0, 1)}.${parts[1]!.slice(0, 1)}`;
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { admin, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-surface-border bg-surface-raised/90 px-4 backdrop-blur sm:px-6">
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-xl p-2 text-ink-muted hover:bg-surface-muted lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          aria-label="تبديل الوضع الليلي"
        >
          {resolvedTheme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <Link
          href="/notifications"
          className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          aria-label="الإشعارات"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Link>

        {admin && (
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-xl py-1.5 ps-1.5 pe-2.5 transition-colors hover:bg-surface-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {initialsOf(admin.name)}
                </div>
                <div className="hidden text-start sm:block">
                  <p className="text-xs font-bold text-ink">{admin.name}</p>
                  <p className="text-[11px] text-ink-faint">{admin.role.name ?? "—"}</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-ink-faint sm:block" />
              </button>
            }
          >
            <Link href="/settings" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm font-medium text-ink transition-colors hover:bg-surface-muted">
              <SettingsIcon className="h-4 w-4" /> الإعدادات
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm font-medium text-danger-500 transition-colors hover:bg-danger-50"
            >
              <LogOut className="h-4 w-4" /> تسجيل الخروج
            </button>
          </Dropdown>
        )}
      </header>

      <MobileSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
