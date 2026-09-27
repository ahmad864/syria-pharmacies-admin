"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cross, LogOut } from "lucide-react";
import { NAV_SECTIONS } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

function isActive(pathname: string, href: string, matchPrefix?: boolean) {
  if (matchPrefix) return pathname === href || pathname.startsWith(href + "/");
  return pathname === href;
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { hasPermission, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Cross className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-ink">صيدليات سوريا</p>
          <p className="text-[11px] font-medium text-ink-faint">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section, i) => {
          const visibleItems = section.items.filter((item) => !item.permission || hasPermission(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={i} className="mb-1 mt-3 first:mt-0">
              {section.title && (
                <p className="px-3 pb-1.5 text-[11px] font-bold text-ink-faint">{section.title}</p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(pathname, item.href, item.matchPrefix);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                          active ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                        )}
                      >
                        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-600 dark:text-brand-300" : "text-ink-faint")} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-surface-border p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger-500 transition-colors hover:bg-danger-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

/** Fixed desktop sidebar (≥1024px); collapses away below that in favor of MobileSidebar's drawer. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-[260px] border-e border-surface-border bg-surface-raised lg:block">
      <SidebarContent />
    </aside>
  );
}
