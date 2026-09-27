"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/states/ErrorState";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listRoles, listPermissions, createRole, updateRole, deleteRole } from "@/services/roles.service";
import type { Role, Permission } from "@/types/roles";
import { ApiError } from "@/lib/api-error";

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const { data: roles, loading, error, errorMessage, refetch } = useApiQuery(listRoles);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    listPermissions()
      .then(setPermissions)
      .catch(() => toast.error("تعذّر تحميل قائمة الصلاحيات"))
      .finally(() => setPermissionsLoaded(true));
  }, []);

  const [selected, setSelected] = useState<Role | null>(null);
  const createDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openEdit(role: Role) {
    setSelected(role);
    setSelectedPermissionIds(new Set(role.permissionIds));
    setName(role.name);
    setDescription(role.description ?? "");
    setFormError(null);
    createDialog.open();
  }

  function openCreate() {
    setSelected(null);
    setSelectedPermissionIds(new Set());
    setName("");
    setDescription("");
    setFormError(null);
    createDialog.open();
  }

  function togglePermission(id: number) {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const input = { name, description: description || undefined, permissionIds: Array.from(selectedPermissionIds) };
      if (selected) {
        await updateRole(selected.id, input);
        toast.success(`تم تحديث دور "${name}"`);
      } else {
        await createRole(input);
        toast.success(`تم إنشاء دور "${name}"`);
      }
      createDialog.close();
      refetch();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "تعذّر حفظ الدور");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await deleteRole(selected.id);
      toast.success(`تم حذف دور "${selected.name}"`);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "تعذّر حذف الدور");
    }
  }

  const groups = Array.from(new Set(permissions.map((p) => p.group)));

  if (error) {
    return (
      <div>
        <PageHeader title="الأدوار والصلاحيات" />
        <Card>
          <ErrorState description={errorMessage ?? undefined} onRetry={refetch} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="الأدوار والصلاحيات"
        description="تحديد أدوار المديرين وما يمكن لكل دور القيام به — الصلاحيات مفروضة فعليًا من الخادم على كل طلب، وليست مجرد إخفاء أزرار في الواجهة"
        actions={
          hasPermission("roles.create") && (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> دور جديد
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading || !roles
          ? Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-40 animate-pulse" />)
          : roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {role.name}
                      {role.isSystem && <Lock className="h-3.5 w-3.5 text-ink-faint" />}
                    </CardTitle>
                    <p className="mt-1 text-xs text-ink-muted">{role.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                    <Users className="h-3.5 w-3.5" /> {role.usersCount} مستخدمين
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {role.permissionIds.slice(0, 3).map((pid) => (
                      <Badge key={pid} tone="neutral">
                        {permissions.find((p) => p.id === pid)?.label ?? "…"}
                      </Badge>
                    ))}
                    {role.permissionIds.length > 3 && <Badge tone="neutral">+{role.permissionIds.length - 3}</Badge>}
                  </div>
                  {(hasPermission("roles.edit") || (hasPermission("roles.delete") && !role.isSystem)) && (
                    <div className="mt-4 flex items-center gap-2">
                      {hasPermission("roles.edit") && !role.isSystem && (
                        <Button size="sm" variant="outline" onClick={() => openEdit(role)}>
                          <Pencil className="h-3.5 w-3.5" /> تعديل
                        </Button>
                      )}
                      {hasPermission("roles.delete") && !role.isSystem && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger-500 hover:bg-danger-50"
                          onClick={() => {
                            setSelected(role);
                            deleteDialog.open();
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> حذف
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        title={selected ? `تعديل دور: ${selected.name}` : "إنشاء دور جديد"}
        size="lg"
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{formError}</div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="اسم الدور" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-ink-muted">الصلاحيات</p>
          <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border border-surface-border p-4">
            {!permissionsLoaded ? (
              <p className="text-xs text-ink-faint">جارِ تحميل الصلاحيات...</p>
            ) : (
              groups.map((group) => (
                <div key={group}>
                  <p className="mb-2 text-xs font-bold text-ink-faint">{group}</p>
                  <div className="space-y-2">
                    {permissions.filter((p) => p.group === group).map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between">
                        <span className="text-sm text-ink">{perm.label}</span>
                        <Switch checked={selectedPermissionIds.has(perm.id)} onChange={() => togglePermission(perm.id)} label={perm.label} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={createDialog.close} disabled={saving}>إلغاء</Button>
          <Button onClick={handleSave} loading={saving} disabled={!name.trim()}>
            {selected ? "حفظ التغييرات" : "إنشاء الدور"}
          </Button>
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="حذف الدور"
        description={`هل أنت متأكد من حذف دور "${selected?.name ?? ""}"؟ لا يمكن حذف دور مرتبط بمستخدمين حاليًا.`}
        confirmLabel="حذف"
      />
    </div>
  );
}
