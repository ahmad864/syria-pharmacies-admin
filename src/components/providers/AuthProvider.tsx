"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  getSessionToken,
  setSessionToken,
  clearSessionToken,
} from "@/lib/session";
import * as authService from "@/services/auth.service";
import type { AdminAccount } from "@/types/auth";

interface AuthContextValue {
  admin: AdminAccount | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (slug: string) => boolean;
  setAdmin: (admin: AdminAccount) => void;
  applyNewToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const forceLogout = useCallback(
    (message?: string) => {
      clearSessionToken();
      setAdmin(null);

      if (message) {
        toast.error(message);
      }

      router.push("/login");
    },
    [router]
  );

  useEffect(() => {
    apiClient.onUnauthenticated = () => {
      forceLogout("انتهت صلاحية الجلسة يرجى تسجيل الدخول مرة أخرى");
    };

    return () => {
      apiClient.onUnauthenticated = null;
    };
  }, [forceLogout]);

  useEffect(() => {
    let mounted = true;

    const token = getSessionToken();

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((account) => {
        if (!mounted) return;
        setAdmin(account);
      })
      .catch(() => {
        if (!mounted) return;

        clearSessionToken();
        setAdmin(null);
        router.replace("/login");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const result = await authService.login({
        identifier,
        password,
      });

      setSessionToken(result.token);
      setAdmin(result.admin);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best-effort logout: clear the local session regardless of network result.
    }

    clearSessionToken();
    setAdmin(null);
    router.push("/login");
  }, [router]);

  const hasPermission = useCallback(
    (slug: string) => admin?.permissions.includes(slug) ?? false,
    [admin]
  );

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

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
