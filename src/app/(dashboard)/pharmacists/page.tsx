"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, MoreVertical, Ban, CheckCircle2 } from "lucide-react";
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
import { listPharmacists, updatePharmacistStatus } from "@/services/pharmacist.service";
import { GOVERNORATES } from "@/types/pharmacy";
import type { Pharmacist } from "@/types/pharmacist";
import { ACCOUNT_STATUS_LABEL } from "@/constants/status";

export default function PharmacistsPage() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const [target, setTarget] = useState<Pharmacist | null>(null);
  const toggleDialog = useDisclosure();

  const query = useMemo(
    () => ({ search: debouncedSearch, governorate: governorate || undefined, page, perPage: 10 }),
    [debouncedSearch, governorate, page]
  );
  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listPharmacists(query), [query.search, query.governorate, query.page]);

  async function handleToggle() {
    if (!target) return;
    const next = target.status === "active" ? "disabled" : "active";
    await updatePharmacistStatus(target.id, next);
    toast.success(next === "active" ? `تم تفعيل حساب ${target.name}` : `تم تعطيل حساب ${target.name}`);
    refetch();
  }

  const columns: Column<Pharmacist>[] = [
    { key: "name", header: "الاسم", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
    { key: "phone", header: "الهاتف", render: (p) => <span dir="ltr">{p.phone}</span> },
    { key: "pharmacy", header: "الصيدلية", render: (p) => p.pharmacyName },
    { key: "governorate", header: "المحافظة", render: (p) => p.governorate },
    {
      key: "status",
      header: "الحالة",
      render: (p) => <Badge tone={p.status === "active" ? "success" : "neutral"} dot>{ACCOUNT_STATUS_LABEL[p.status]}</Badge>,
    },
    {
      key: "verified",
      header: "التحقق",
      render: (p) =>
        p.phoneVerified ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600"><ShieldCheck className="h-3.5 w-3.5" /> موثّق</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-ink-faint"><ShieldOff className="h-3.5 w-3.5" /> غير موثّق</span>
        ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (p) =>
        !hasPermission("pharmacists.approve") ? (
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
                  setTarget(p);
                  toggleDialog.open();
                }}
                danger={p.status === "active"}
              >
                {p.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {p.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
              </DropdownItem>
            </Dropdown>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="الصيادلة" description="حسابات الصيادلة المسؤولين عن الصيدليات المسجّلة" />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث بالاسم أو الهاتف أو الصيدلية..." className="sm:w-72" />
          <div className="sm:w-44">
            <Select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setPage(1); }}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </div>
        </TableFilters>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        getRowId={(p) => p.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا يوجد صيادلة"
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
