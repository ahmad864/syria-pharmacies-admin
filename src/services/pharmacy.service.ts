import { apiClient } from "@/lib/api-client";
import { mapPagination } from "@/lib/api-mappers";
import { mapPharmacy, type Pharmacy, type PharmacyStatus } from "@/types/pharmacy";
import type { ListQuery, PaginatedResult } from "@/types/api";

export interface PharmacyListQuery extends ListQuery {
  governorate?: string;
  region?: string;
  status?: PharmacyStatus;
  /** 'open' | 'on_duty' — computed live by Laravel from working hours/duty/temp-closure, never a stored flag. */
  opening?: "open" | "on_duty";
}

interface RawListResponse {
  items: Record<string, unknown>[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

/** GET /api/v1/admin/pharmacies */
export async function listPharmacies(query: PharmacyListQuery = {}): Promise<PaginatedResult<Pharmacy>> {
  const raw = await apiClient.get<RawListResponse>("/admin/pharmacies", {
    search: query.search,
    governorate: query.governorate,
    region: query.region,
    status: query.status,
    opening: query.opening,
    page: query.page,
    per_page: query.perPage ?? 10,
  });
  return { items: raw.items.map(mapPharmacy), pagination: mapPagination(raw.pagination) };
}

/** GET /api/v1/admin/pharmacies/{id} */
export async function getPharmacy(id: string): Promise<Pharmacy | null> {
  const raw = await apiClient.get<Record<string, unknown>>(`/admin/pharmacies/${id}`);
  return raw ? mapPharmacy(raw) : null;
}

/** PUT /api/v1/admin/pharmacies/{id} */
export async function updatePharmacy(id: string, patch: Partial<Pick<Pharmacy, "name" | "governorate" | "region" | "address" | "phone">>): Promise<Pharmacy> {
  const raw = await apiClient.put<Record<string, unknown>>(`/admin/pharmacies/${id}`, patch);
  return mapPharmacy(raw);
}

/** POST /api/v1/admin/pharmacies/{id}/approve */
export async function approvePharmacy(id: string): Promise<Pharmacy> {
  const raw = await apiClient.post<Record<string, unknown>>(`/admin/pharmacies/${id}/approve`);
  return mapPharmacy(raw);
}

/** POST /api/v1/admin/pharmacies/{id}/reject */
export async function rejectPharmacy(id: string, reason: string): Promise<Pharmacy> {
  const raw = await apiClient.post<Record<string, unknown>>(`/admin/pharmacies/${id}/reject`, { reason });
  return mapPharmacy(raw);
}

/** DELETE /api/v1/admin/pharmacies/{id} — soft-disables server-side, never a hard destructive delete. */
export async function deletePharmacy(id: string): Promise<void> {
  await apiClient.delete(`/admin/pharmacies/${id}`);
}
