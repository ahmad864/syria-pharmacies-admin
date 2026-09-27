import { apiClient } from "@/lib/api-client";
import { mapPagination } from "@/lib/api-mappers";
import type { Pharmacist } from "@/types/pharmacist";
import type { ListQuery, PaginatedResult } from "@/types/api";

export interface PharmacistListQuery extends ListQuery {
  governorate?: string;
  status?: Pharmacist["status"];
}

interface RawPharmacist {
  id: string; name: string; phone: string; phone_verified: boolean;
  pharmacy_id: string | null; pharmacy_name: string | null; governorate: string | null;
  status: Pharmacist["status"]; created_at: string;
}
interface RawListResponse {
  items: RawPharmacist[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

function mapPharmacist(raw: RawPharmacist): Pharmacist {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    phoneVerified: raw.phone_verified,
    pharmacyId: raw.pharmacy_id ?? "",
    pharmacyName: raw.pharmacy_name ?? "—",
    governorate: (raw.governorate ?? "دمشق") as Pharmacist["governorate"],
    status: raw.status,
    createdAt: raw.created_at,
  };
}

/** GET /api/v1/admin/pharmacists */
export async function listPharmacists(query: PharmacistListQuery = {}): Promise<PaginatedResult<Pharmacist>> {
  const raw = await apiClient.get<RawListResponse>("/admin/pharmacists", {
    search: query.search,
    governorate: query.governorate,
    status: query.status,
    page: query.page,
    per_page: query.perPage ?? 10,
  });
  return { items: raw.items.map(mapPharmacist), pagination: mapPagination(raw.pagination) };
}

/** PUT /api/v1/admin/pharmacists/{id} */
export async function updatePharmacistStatus(id: string, status: Pharmacist["status"]): Promise<void> {
  await apiClient.put(`/admin/pharmacists/${id}`, { status });
}
