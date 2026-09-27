export interface Permission {
  id: number;
  slug: string;
  label: string;
  group: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  usersCount: number;
  permissionIds: number[];
}
