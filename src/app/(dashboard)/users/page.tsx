"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Ban, CheckCircle2, Heart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableFilters } from "@/components/tables/TableFilters";
import { SearchInput } from "@/components/forms/SearchInput";
import { Select } from "@/components/ui/Select";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listUsers, updateUserStatus } from "@/services/user.service";
import type { AppUser, UserStatus } from "@/types/user";
import { ACCOUNT_STATUS_LABEL } from "@/constants/status";
import { formatDate } from "@/lib/utils";

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const [target, setTarget] = useState<AppUser | null>(null);
  const toggleDialog = useDisclosure();

  const query = useMemo(() => ({ search: debouncedSearch, status: status || undefined, page, perPage: 10 }), [debouncedSearch, status, page]);
  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listUsers(query), [query.search, query.status, query.page]);

  async function handleToggle() {
    if (!target) return;
    const next: UserStatus = target.status === "active" ? "disabled" : "active";
    await updateUserStatus(target.id, next);
    toast.success(next === "active" ? `تم تفعيل حساب ${target.name}` : `تم تعطيل حساب ${target.name}`);
    refetch();
  }

  const columns: Column<AppUser>[] = [
    { key: "name", header: "الاسم", render: (u) => <span className="font-semibold text-ink">{u.name}</span> },
    { key: "phone", header: "الهاتف", render: (u) => <span dir="ltr">{u.phone}</span> },
    { key: "role", header: "الدور", render: () => <Badge tone="brand">مستخدم</Badge> },
    {
      key: "favorites",
      header: "المفضلة",
      render: (u) => (
        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
          <Heart className="h-3.5 w-3.5" /> {u.favoritesCount}
        </span>
      ),
    },
    { key: "status", header: "الحالة", render: (u) => <Badge tone={u.status === "active" ? "success" : "neutral"} dot>{ACCOUNT_STATUS_LABEL[u.status]}</Badge> },
    { key: "createdAt", header: "تاريخ التسجيل", sortable: true, render: (u) => formatDate(u.createdAt) },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (u) =>
        !hasPermission("users.disable") ? (
          <span className="block text-end text-xs text-ink-faint">—</span>
        ) : (
          <div className="flex justify-end">
            <Dropdown
              trigger={
                <button className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-muted hover:text-ink" aria-label="إجراءات">
                  <MoreVertical className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem
                onClick={() => {
                  setTarget(u);
                  toggleDialog.open();
                }}
                danger={u.status === "active"}
              >
                {u.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {u.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
              </DropdownItem>
            </Dropdown>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="المستخدمون" description="حسابات مستخدمي تطبيق صيدليات سوريا" />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث بالاسم أو رقم الهاتف..." className="sm:w-72" />
          <div className="sm:w-40">
            <Select value={status} onChange={(e) => { setStatus(e.target.value as UserStatus | ""); setPage(1); }}>
              <option value="">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="disabled">معطّل</option>
            </Select>
          </div>
        </TableFilters>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        getRowId={(u) => u.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا يوجد مستخدمون"
        pagination={data?.pagination}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={toggleDialog.isOpen}
        onClose={toggleDialog.close}
        onConfirm={handleToggle}
        title={target?.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
        description={`هل تريد ${target?.status === "active" ? "تعطيل" : "تفعيل"} حساب "${target?.name ?? ""}"؟`}
        confirmLabel={target?.status === "active" ? "تعطيل" : "تفعيل"}
        danger={target?.status === "active"}
      />
    </div>
  );
}
