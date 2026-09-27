import { apiClient } from "@/lib/api-client";
import { mapPagination } from "@/lib/api-mappers";
import type { DutyEntry } from "@/types/duty";
import type { ListQuery, PaginatedResult } from "@/types/api";

export interface DutyListQuery extends ListQuery {
  governorate?: string;
  /** 1 (Monday) .. 7 (Sunday) — matches PharmacyDutyResource.day_of_week. */
  dayOfWeek?: number;
}

interface RawPharmacyRef { id: string | number; name: string; governorate: string; region: string }
interface RawDuty { id: string | number; day_of_week: number; day_name: string; from: string; to: string; pharmacy?: RawPharmacyRef }
interface RawListResponse {
  items: RawDuty[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

/** GET /api/v1/admin/duties — all filters (search/governorate/day_of_week) pushed down to SQL. */
export async function listDuties(query: DutyListQuery = {}): Promise<PaginatedResult<DutyEntry>> {
  const raw = await apiClient.get<RawListResponse>("/admin/duties", {
    day_of_week: query.dayOfWeek,
    governorate: query.governorate,
    search: query.search,
    page: query.page,
    per_page: query.perPage ?? 10,
  });

  const items: DutyEntry[] = raw.items.map((row) => ({
    id: String(row.id),
    pharmacyId: row.pharmacy ? String(row.pharmacy.id) : "",
    pharmacyName: row.pharmacy?.name ?? "—",
    governorate: (row.pharmacy?.governorate ?? "دمشق") as DutyEntry["governorate"],
    region: row.pharmacy?.region ?? "",
    dayOfWeek: row.day_of_week,
    dayName: row.day_name,
    from: row.from,
    to: row.to,
    status: "scheduled",
  }));

  return { items, pagination: mapPagination(raw.pagination) };
}
