import { apiClient } from "@/lib/api-client";
import type { Pharmacy } from "@/types/pharmacy";
import type { StatCard, TimeSeriesPoint, GovernorateBreakdown } from "@/types/dashboard";

export interface RecentActivityItem {
  id: string;
  adminName: string;
  actionLabel: string;
  targetLabel: string | null;
  createdAt: string;
}

export interface DashboardSummary {
  stats: StatCard[];
  governorateBreakdown: GovernorateBreakdown[];
  recentApplications: Pick<Pharmacy, "id" | "name" | "governorate" | "ownerName" | "createdAt">[];
  recentActivity: RecentActivityItem[];
  pharmacyTrend: TimeSeriesPoint[];
  userTrend: TimeSeriesPoint[];
}

interface RawSummary {
  stats: { id: string; label: string; value: number }[];
  governorate_breakdown: { governorate: string; count: number }[];
  recent_applications: { id: string; name: string; governorate: string; owner_name: string | null; created_at: string }[];
  recent_activity: { id: string; admin_name: string; action_label: string; target_label: string | null; created_at: string }[];
  pharmacy_trend: { label: string; value: number }[];
  user_trend: { label: string; value: number }[];
}

/**
 * GET /api/v1/admin/dashboard/summary — every figure here is a real
 * aggregate computed by Laravel directly from PostgreSQL. No delta/trend
 * percentage is fabricated: `StatCard.delta` is simply absent because no
 * historical snapshot exists to compare against (see
 * DashboardController::monthlyTrend doc comment on the backend).
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const raw = await apiClient.get<RawSummary>("/admin/dashboard/summary");

  return {
    stats: raw.stats,
    governorateBreakdown: raw.governorate_breakdown,
    recentApplications: raw.recent_applications.map((a) => ({
      id: a.id,
      name: a.name,
      governorate: a.governorate as Pharmacy["governorate"],
      ownerName: a.owner_name,
      createdAt: a.created_at,
    })),
    recentActivity: raw.recent_activity.map((a) => ({
      id: a.id,
      adminName: a.admin_name,
      actionLabel: a.action_label,
      targetLabel: a.target_label,
      createdAt: a.created_at,
    })),
    pharmacyTrend: raw.pharmacy_trend,
    userTrend: raw.user_trend,
  };
}
