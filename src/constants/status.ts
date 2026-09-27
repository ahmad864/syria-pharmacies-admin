import type { PharmacyStatus, OpeningStatusKey } from "@/types/pharmacy";
import type { UserStatus } from "@/types/user";
import type { AdvertisementStatus } from "@/types/advertisement";

export const PHARMACY_STATUS_LABEL: Record<PharmacyStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مفعّلة",
  rejected: "مرفوضة",
  disabled: "معطّلة",
};

export const OPENING_STATUS_LABEL: Record<OpeningStatusKey, string> = {
  open: "مفتوحة الآن",
  closed: "مغلقة",
  temp: "إغلاق مؤقت",
  onduty: "مناوبة",
};

export const ACCOUNT_STATUS_LABEL: Record<UserStatus, string> = {
  active: "نشط",
  disabled: "معطّل",
};

export const AD_STATUS_LABEL: Record<AdvertisementStatus, string> = {
  active: "فعّال",
  scheduled: "مجدوَل",
  expired: "منتهي",
  disabled: "معطّل",
};

export const WEEKDAY_LABELS: Record<number, string> = {
  1: "الاثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
  7: "الأحد",
};

/** Display order requested in the brief: السبت أولاً (Saturday-first Arabic week). */
export const WEEKDAY_DISPLAY_ORDER = [6, 7, 1, 2, 3, 4, 5];
