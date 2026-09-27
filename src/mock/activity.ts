import type { ActivityLogEntry } from "@/types/activity";
import { seededRandom, isoDaysAgo } from "./seed";

const ADMINS = ["سامر خطيب", "رهام العلي", "زياد نصور"];
const ACTIONS: { action: ActivityLogEntry["action"]; label: string; target: string }[] = [
  { action: "approve", label: "وافق على صيدلية", target: "صيدلية" },
  { action: "reject", label: "رفض صيدلية", target: "صيدلية" },
  { action: "update", label: "عدّل بيانات صيدلية", target: "صيدلية" },
  { action: "delete", label: "حذف مستخدم", target: "مستخدم" },
  { action: "create", label: "أضاف إعلانًا جديدًا", target: "إعلان" },
  { action: "update", label: "حدّث حالة مستخدم", target: "مستخدم" },
  { action: "login", label: "سجّل الدخول", target: "النظام" },
  { action: "update", label: "غيّر صلاحيات دور", target: "دور" },
];

export const MOCK_ACTIVITY_LOG: ActivityLogEntry[] = Array.from({ length: 40 }, (_, i) => {
  const rand = seededRandom(11000 + i);
  const a = ACTIONS[i % ACTIONS.length]!;
  return {
    id: `activity-${i}`,
    adminName: ADMINS[Math.floor(rand() * ADMINS.length)]!,
    adminAvatarUrl: null,
    action: a.action,
    actionLabel: a.label,
    targetType: a.target,
    targetLabel: `${a.target} #${1000 + i}`,
    details: `تم تنفيذ العملية بنجاح عبر لوحة التحكم.`,
    createdAt: isoDaysAgo(rand() * 30),
  };
});
