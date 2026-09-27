import { apiClient } from "@/lib/api-client";
import type { AdminAccount } from "@/types/auth";

export interface LoginInput {
  identifier: string; // email OR phone
  password: string;
}

/** POST /admin/auth/login — email OR phone + password, never OTP for admins. */
export async function login(input: LoginInput): Promise<{ token: string; admin: AdminAccount }> {
  return apiClient.post<{ token: string; admin: AdminAccount }>("/admin/auth/login", input);
}

/** POST /admin/auth/logout */
export async function logout(): Promise<void> {
  await apiClient.post("/admin/auth/logout");
}

/** GET /admin/auth/me */
export async function me(): Promise<AdminAccount> {
  return apiClient.get<AdminAccount>("/admin/auth/me");
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  phone: string;
}

/** PUT /admin/auth/profile */
export async function updateProfile(input: UpdateProfileInput): Promise<AdminAccount> {
  return apiClient.put<AdminAccount>("/admin/auth/profile", input);
}

export interface UpdatePasswordInput {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

/** PUT /admin/auth/password — revokes all other sessions server-side, returns a fresh token for the caller's own session. */
export async function updatePassword(input: UpdatePasswordInput): Promise<{ token: string }> {
  return apiClient.put<{ token: string }>("/admin/auth/password", {
    current_password: input.currentPassword,
    password: input.password,
    password_confirmation: input.passwordConfirmation,
  });
}
