import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Store, FileClock, Stethoscope, Users, Moon,
  Map, Megaphone, Bell, BarChart3, History, Settings, ShieldCheck,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Highlights the item as active for any route under this prefix, not just an exact match. */
  matchPrefix?: boolean;
  /** Permission slug required to see this item — omit for items every admin can see (dashboard, settings). */
  permission?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" }],
  },
  {
    title: "الصيدليات",
    items: [
      { label: "الصيدليات", href: "/pharmacies", icon: Store, matchPrefix: true, permission: "pharmacies.view" },
      { label: "طلبات الصيدليات", href: "/pharmacies/applications", icon: FileClock, permission: "pharmacies.view" },
      { label: "الصيادلة", href: "/pharmacists", icon: Stethoscope, permission: "pharmacists.view" },
      { label: "المستخدمون", href: "/users", icon: Users, permission: "users.view" },
      { label: "صيدليات المناوبة", href: "/duty-pharmacies", icon: Moon, permission: "pharmacies.view" },
    ],
  },
  {
    items: [{ label: "الخريطة", href: "/map", icon: Map, permission: "pharmacies.view" }],
  },
  {
    title: "التواصل",
    items: [
      { label: "الإعلانات", href: "/advertisements", icon: Megaphone, permission: "ads.view" },
      { label: "الإشعارات", href: "/notifications", icon: Bell, permission: "notifications.view" },
    ],
  },
  {
    title: "التقارير والمراقبة",
    items: [
      { label: "التقارير", href: "/reports", icon: BarChart3, permission: "reports.view" },
      { label: "سجل النشاط", href: "/activity-log", icon: History, permission: "activity_logs.view" },
    ],
  },
  {
    items: [{ label: "الإعدادات", href: "/settings", icon: Settings, matchPrefix: true }],
  },
];

export const ROLES_NAV_ITEM: NavItem = { label: "الأدوار والصلاحيات", href: "/settings/roles", icon: ShieldCheck, permission: "roles.view" };
