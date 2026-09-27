"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { getSessionToken, setSessionToken, clearSessionToken } from "@/lib/session";
import * as authService from "@/services/auth.service";
import type { AdminAccount } from "@/types/auth";

interface AuthContextValue {
  admin: AdminAccount | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (slug: string) => boolean;
  /** Updates the in-memory admin profile after a successful PUT /admin/auth/profile, without a full page reload. */
  setAdmin: (admin: AdminAccount) => void;
  /** Stores a freshly-issued token after a password change (the old one is revoked server-side). */
  applyNewToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Wraps the whole app. Restores the session from the stored token on
 * mount (calling the real `GET /admin/auth/me`, never trusting a cached
 * client-side flag alone), and reacts globally to 401s from any API call
 * by clearing the session and bouncing to /login — this is what makes
 * "عند 401 يتم تسجيل الخروج وإعادة المستخدم إلى Login" true everywhere,
 * not just on the page that happened to trigger it.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const forceLogout = useCallback(
    (message?: string) => {
      clearSessionToken();
      setAdmin(null);
      if (message) toast.error(message);
      router.push("/login");
    },
    [router]
  );

  useEffect(() => {
    apiClient.onUnauthenticated = () => forceLogout("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
    return () => {
      apiClient.onUnauthenticated = null;
    };
  }, [forceLogout]);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(setAdmin)
      .catch(() => clearSessionToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const result = await authService.login({ identifier, password });
    setSessionToken(result.token);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best-effort — clear the local session regardless of network result.
    }
    clearSessionToken();
    setAdmin(null);
    router.push("/login");
  }, [router]);

  const hasPermission = useCallback((slug: string) => admin?.permissions.includes(slug) ?? false, [admin]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
        hasPermission,
        setAdmin,
        applyNewToken: setSessionToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
