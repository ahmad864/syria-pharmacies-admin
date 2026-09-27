import type { StatCard, TimeSeriesPoint, GovernorateBreakdown, ActivityOverviewPoint } from "@/types/dashboard";
import { MOCK_PHARMACIES } from "./pharmacies";
import { MOCK_USERS } from "./users";
import { MOCK_PHARMACISTS } from "./pharmacists";

const approvedCount = MOCK_PHARMACIES.filter((p) => p.status === "approved").length;
const pendingCount = MOCK_PHARMACIES.filter((p) => p.status === "pending").length;
const dutyCount = MOCK_PHARMACIES.filter((p) => p.isOnDutyToday).length;

export const MOCK_STAT_CARDS: StatCard[] = [
  { id: "pharmacies", label: "إجمالي الصيدليات", value: MOCK_PHARMACIES.length, delta: 4.2, trend: "up" },
  { id: "active-pharmacies", label: "الصيدليات النشطة", value: approvedCount, delta: 3.1, trend: "up" },
  { id: "applications", label: "طلبات الصيدليات", value: pendingCount, delta: -1.4, trend: "down" },
  { id: "pharmacists", label: "إجمالي الصيادلة", value: MOCK_PHARMACISTS.length, delta: 2.6, trend: "up" },
  { id: "users", label: "إجمالي المستخدمين", value: MOCK_USERS.length, delta: 6.8, trend: "up" },
  { id: "duty", label: "صيدليات المناوبة", value: dutyCount, delta: 0, trend: "flat" },
];

const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس"];

export const MOCK_PHARMACY_TREND: TimeSeriesPoint[] = MONTHS.map((label, i) => ({
  label, value: 20 + i * 5 + (i % 3) * 3,
}));

export const MOCK_USER_TREND: TimeSeriesPoint[] = MONTHS.map((label, i) => ({
  label, value: 40 + i * 9 + (i % 2) * 4,
}));

export const MOCK_GOVERNORATE_BREAKDOWN: GovernorateBreakdown[] = Object.entries(
  MOCK_PHARMACIES.reduce<Record<string, number>>((acc, p) => {
    acc[p.governorate] = (acc[p.governorate] ?? 0) + 1;
    return acc;
  }, {})
)
  .map(([governorate, count]) => ({ governorate, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

export const MOCK_ACTIVITY_OVERVIEW: ActivityOverviewPoint[] = MONTHS.map((label, i) => ({
  label,
  pharmacies: 5 + i * 2,
  users: 12 + i * 4,
}));

export const MOCK_STATUS_DISTRIBUTION = [
  { label: "مفعّلة", value: approvedCount },
  { label: "قيد المراجعة", value: pendingCount },
  { label: "مرفوضة", value: MOCK_PHARMACIES.filter((p) => p.status === "rejected").length },
  { label: "معطّلة", value: MOCK_PHARMACIES.filter((p) => p.status === "disabled").length },
];
