import { apiClient } from "@/lib/api-client";
import type { Permission, Role } from "@/types/roles";

interface RawRole {
  id: string; name: string; slug: string; description: string | null;
  is_system: boolean; users_count: number; permission_ids: number[];
}

function mapRole(raw: RawRole): Role {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    isSystem: raw.is_system,
    usersCount: raw.users_count,
    permissionIds: raw.permission_ids ?? [],
  };
}

/** GET /api/v1/admin/roles */
export async function listRoles(): Promise<Role[]> {
  const raw = await apiClient.get<RawRole[]>("/admin/roles");
  return raw.map(mapRole);
}

/** GET /api/v1/admin/permissions */
export async function listPermissions(): Promise<Permission[]> {
  return apiClient.get<Permission[]>("/admin/permissions");
}

export interface RoleInput {
  name: string;
  description?: string;
  permissionIds: number[];
}

/** POST /api/v1/admin/roles */
export async function createRole(input: RoleInput): Promise<Role> {
  const raw = await apiClient.post<RawRole>("/admin/roles", {
    name: input.name,
    description: input.description,
    permission_ids: input.permissionIds,
  });
  return mapRole(raw);
}

/** PUT /api/v1/admin/roles/{id} */
export async function updateRole(id: string, input: RoleInput): Promise<Role> {
  const raw = await apiClient.put<RawRole>(`/admin/roles/${id}`, {
    name: input.name,
    description: input.description,
    permission_ids: input.permissionIds,
  });
  return mapRole(raw);
}

/** DELETE /api/v1/admin/roles/{id} */
export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete(`/admin/roles/${id}`);
}
