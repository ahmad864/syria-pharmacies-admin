export type UserRole = "user" | "pharmacy" | "admin";
export type UserStatus = "active" | "disabled";

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  phoneVerified: boolean;
  favoritesCount: number;
  createdAt: string;
}
