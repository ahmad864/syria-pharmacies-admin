"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { ShieldCheck, Sun, Moon, Monitor, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateProfile, updatePassword } from "@/services/auth.service";
import { ApiError } from "@/lib/api-error";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { admin, setAdmin, applyNewToken } = useAuth();

  return (
    <div>
      <PageHeader title="الإعدادات" description="إدارة إعدادات حسابك وتفضيلات لوحة التحكم" />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="language">اللغة</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        <div className="mt-5 max-w-2xl">
          <TabsContent value="profile">
            <ProfileForm admin={admin} onSaved={setAdmin} />
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>المظهر</CardTitle>
                  <CardDescription>تخصيص مظهر لوحة التحكم — يُحفظ فورًا في متصفحك</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "light", label: "فاتح", icon: Sun },
                    { key: "dark", label: "داكن", icon: Moon },
                    { key: "system", label: "النظام", icon: Monitor },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setTheme(opt.key)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-semibold transition-colors",
                        theme === opt.key ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10" : "border-surface-border text-ink-muted hover:bg-surface-muted"
                      )}
                    >
                      <opt.icon className="h-5 w-5" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>اللغة</CardTitle>
                  <CardDescription>لغة واجهة لوحة التحكم</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm font-semibold text-ink">
                  العربية (الوضع الوحيد المتاح حاليًا)
                </div>
                <p className="text-xs text-ink-faint">
                  دعم اللغة الإنجليزية غير مُفعّل بعد. كل الواجهة مبنية باستخدام خصائص CSS منطقية
                  (start/end) بدل left/right تحديدًا لتسهيل إضافته لاحقًا دون إعادة كتابة الأنماط.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-5">
              <PasswordForm onChanged={applyNewToken} />

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-brand-600" /> الأدوار والصلاحيات
                    </CardTitle>
                    <CardDescription>إدارة أدوار المديرين وصلاحياتهم</CardDescription>
                  </div>
                  <Link href="/settings/roles" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
                    فتح الصفحة <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ProfileForm({ admin, onSaved }: { admin: ReturnType<typeof useAuth>["admin"]; onSaved: (a: NonNullable<ReturnType<typeof useAuth>["admin"]>) => void }) {
  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [phone, setPhone] = useState(admin?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({ name, email, phone });
      onSaved(updated);
      toast.success("تم حفظ الملف الشخصي");
    } catch (err) {
      setError(err instanceof ApiError ? (err.firstErrorFor("email") ?? err.firstErrorFor("phone") ?? err.message) : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>الملف الشخصي</CardTitle>
          <CardDescription>بيانات حساب المدير — تُحدَّث مباشرة على الخادم</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{error}</div>}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
            {name.trim().slice(0, 1) || "؟"}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
        </div>
        <Input label="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} loading={saving} disabled={!name.trim() || !email.trim() || !phone.trim()}>
          حفظ التغييرات
        </Button>
      </CardFooter>
    </Card>
  );
}

function PasswordForm({ onChanged }: { onChanged: (token: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const result = await updatePassword({ currentPassword, password, passwordConfirmation });
      onChanged(result.token);
      toast.success("تم تحديث كلمة المرور بنجاح");
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(err instanceof ApiError ? (err.firstErrorFor("current_password") ?? err.firstErrorFor("password") ?? err.message) : "تعذّر تحديث كلمة المرور");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>تغيير كلمة المرور</CardTitle>
          <CardDescription>يُنصح باستخدام كلمة مرور قوية وعدم مشاركتها — سيتم إبطال أي جلسات أخرى مفتوحة</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{error}</div>}
        <Input label="كلمة المرور الحالية" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <Input label="كلمة المرور الجديدة" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="٨ أحرف على الأقل" />
        <Input label="تأكيد كلمة المرور" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} loading={saving} disabled={!currentPassword || password.length < 8 || password !== passwordConfirmation}>
          تحديث كلمة المرور
        </Button>
      </CardFooter>
    </Card>
  );
}
