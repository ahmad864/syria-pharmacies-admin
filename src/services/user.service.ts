import { apiClient } from "@/lib/api-client";
import { mapPagination } from "@/lib/api-mappers";
import type { AppUser, UserStatus } from "@/types/user";
import type { ListQuery, PaginatedResult } from "@/types/api";

export interface UserListQuery extends ListQuery {
  status?: UserStatus;
}

interface RawUser {
  id: number; name: string | null; phone: string; email: string | null;
  role: string; status: UserStatus; phone_verified: boolean; favorites_count: number | null; created_at: string;
}
interface RawListResponse {
  items: RawUser[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

function mapUser(raw: RawUser): AppUser {
  return {
    id: String(raw.id),
    name: raw.name ?? "بدون اسم",
    phone: raw.phone,
    role: "user",
    status: raw.status,
    phoneVerified: raw.phone_verified,
    favoritesCount: raw.favorites_count ?? 0,
    createdAt: raw.created_at,
  };
}

/** GET /api/v1/admin/users */
export async function listUsers(query: UserListQuery = {}): Promise<PaginatedResult<AppUser>> {
  const raw = await apiClient.get<RawListResponse>("/admin/users", {
    search: query.search,
    status: query.status,
    page: query.page,
    per_page: query.perPage ?? 10,
  });
  return { items: raw.items.map(mapUser), pagination: mapPagination(raw.pagination) };
}

/** PUT /api/v1/admin/users/{id} */
export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await apiClient.put(`/admin/users/${id}`, { status });
}
