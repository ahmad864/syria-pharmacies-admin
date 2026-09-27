"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cross, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError } from "@/lib/api-error";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

/**
 * Real login — email OR phone + password, calling the actual Laravel
 * endpoint via useAuth().login() (POST /admin/auth/login). No mock login,
 * no fake token, no accepted-by-default credentials: a wrong password
 * returns a real 422 from Laravel and is shown inline below.
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.firstErrorFor("identifier") ?? err.message);
      } else {
        setError("تعذر تسجيل الدخول، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-card">
            <Cross className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-lg font-extrabold text-ink">صيدليات سوريا</h1>
          <p className="mt-1 text-sm text-ink-muted">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-surface-border bg-surface-raised p-6 shadow-card">
          {error && (
            <div className="mb-4 rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{error}</div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="pointer-events-none absolute start-3.5 top-[34px] h-4 w-4 text-ink-faint" />
              <Input
                label="البريد الإلكتروني أو رقم الهاتف"
                dir="ltr"
                placeholder="admin@example.com أو 09xxxxxxxx"
                className="ps-10"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute start-3.5 top-[34px] h-4 w-4 text-ink-faint" />
              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                className="ps-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-6 w-full" loading={loading}>
            {loading ? "جارِ الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="mt-5 text-center text-[11px] text-ink-faint">
          الحساب الإداري يُنشأ ويُدار من الخادم — لا يوجد إنشاء حساب من هذه الواجهة.
        </p>
      </div>
    </div>
  );
}
