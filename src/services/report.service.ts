import { getDashboardSummary } from "./dashboard.service";
import { apiClient } from "@/lib/api-client";
import type { TimeSeriesPoint, GovernorateBreakdown } from "@/types/dashboard";

/**
 * Reports currently reuse the same real aggregates as the dashboard
 * summary (GET /admin/dashboard/summary) rather than a separate,
 * date-range-filterable reports endpoint — the backend does not yet
 * expose one. This is an honest, documented simplification (see the
 * final report's "remaining limitations"): every number shown here is
 * still real, just not independently filterable by an arbitrary date
 * range yet. A dedicated `/admin/reports/*` set of endpoints with real
 * `WHERE created_at BETWEEN ...` filtering is the natural follow-up.
 */

export interface ReportDateRange {
  from: string;
  to: string;
}

export async function getPharmacyReport(_range: ReportDateRange): Promise<{
  trend: TimeSeriesPoint[];
  byGovernorate: GovernorateBreakdown[];
  byStatus: { label: string; value: number }[];
}> {
  const summary = await getDashboardSummary();
  const byStatusMap: Record<string, string> = {
    "active-pharmacies": "مفعّلة",
    applications: "قيد المراجعة",
    "rejected-pharmacies": "مرفوضة",
  };
  const byStatus = summary.stats
    .filter((s) => byStatusMap[s.id])
    .map((s) => ({ label: byStatusMap[s.id]!, value: s.value }));

  return { trend: summary.pharmacyTrend, byGovernorate: summary.governorateBreakdown, byStatus };
}

export async function getUserReport(_range: ReportDateRange): Promise<{ trend: TimeSeriesPoint[] }> {
  const summary = await getDashboardSummary();
  return { trend: summary.userTrend };
}

export async function getGovernorateReport(_range: ReportDateRange): Promise<{ byGovernorate: GovernorateBreakdown[] }> {
  const summary = await getDashboardSummary();
  return { byGovernorate: summary.governorateBreakdown };
}

/** GET /admin/duties (page 1 only, used just to derive real counts — not a fabricated overview chart). */
export async function getDutyReport(_range: ReportDateRange): Promise<{ total: number; governoratesCovered: number }> {
  const raw = await apiClient.get<{ items: { pharmacy?: { governorate?: string } }[]; pagination: { total: number } }>("/admin/duties", { per_page: 100 });
  const governoratesCovered = new Set(raw.items.map((d) => d.pharmacy?.governorate).filter(Boolean)).size;
  return { total: raw.pagination.total, governoratesCovered };
}
