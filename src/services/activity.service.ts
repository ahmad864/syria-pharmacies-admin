import { apiClient } from "@/lib/api-client";
import { mapPagination } from "@/lib/api-mappers";
import type { ActivityLogEntry } from "@/types/activity";
import type { ListQuery, PaginatedResult } from "@/types/api";

export interface ActivityListQuery extends ListQuery {
  from?: string;
  to?: string;
}

interface RawEntry {
  id: string; admin_name: string; action: string; action_label: string;
  target_type: string | null; target_label: string | null; details: string | null; created_at: string;
}
interface RawListResponse {
  items: RawEntry[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

function mapEntry(raw: RawEntry): ActivityLogEntry {
  return {
    id: raw.id,
    adminName: raw.admin_name,
    adminAvatarUrl: null,
    action: raw.action,
    actionLabel: raw.action_label,
    targetType: raw.target_type ?? "",
    targetLabel: raw.target_label ?? "—",
    details: raw.details ?? "",
    createdAt: raw.created_at,
  };
}

/** GET /api/v1/admin/activity-log */
export async function listActivityLog(query: ActivityListQuery = {}): Promise<PaginatedResult<ActivityLogEntry>> {
  const raw = await apiClient.get<RawListResponse>("/admin/activity-log", {
    search: query.search,
    from: query.from,
    to: query.to,
    page: query.page,
    per_page: query.perPage ?? 12,
  });
  return { items: raw.items.map(mapEntry), pagination: mapPagination(raw.pagination) };
}
