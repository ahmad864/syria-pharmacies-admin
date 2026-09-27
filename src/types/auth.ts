export interface AdminRole {
  id: number | null;
  name: string | null;
  slug: string | null;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: AdminRole;
  permissions: string[];
}
