"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableFilters } from "@/components/tables/TableFilters";
import { SearchInput } from "@/components/forms/SearchInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { PharmacyStatusBadge } from "@/features/pharmacies/badges";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listPharmacies, deletePharmacy } from "@/services/pharmacy.service";
import { GOVERNORATES, type Pharmacy } from "@/types/pharmacy";
import { toast } from "sonner";

export default function PharmaciesPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Pharmacy | null>(null);
  const confirmDialog = useDisclosure();
  const debouncedSearch = useDebouncedValue(search);

  const query = useMemo(
    () => ({
      search: debouncedSearch,
      governorate: governorate || undefined,
      status: (status || undefined) as Pharmacy["status"] | undefined,
      page,
      perPage: 10,
    }),
    [debouncedSearch, governorate, status, page]
  );

  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listPharmacies(query), [
    query.search, query.governorate, query.status, query.page,
  ]);

  async function handleDelete() {
    if (!toDelete) return;
    await deletePharmacy(toDelete.id);
    toast.success(`تم تعطيل ${toDelete.name}`);
    refetch();
  }

  const columns: Column<Pharmacy>[] = [
    {
      key: "name",
      header: "اسم الصيدلية",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-600">
            {p.name.replace("صيدلية ", "").slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{p.name}</p>
            <p className="truncate text-xs text-ink-faint">{p.region}</p>
          </div>
        </div>
      ),
    },
    { key: "owner", header: "الصيدلي", render: (p) => p.ownerName },
    { key: "phone", header: "الهاتف", render: (p) => <span dir="ltr">{p.phone}</span> },
    { key: "governorate", header: "المحافظة", render: (p) => p.governorate },
    { key: "region", header: "المنطقة", render: (p) => p.region },
    { key: "status", header: "الحالة", render: (p) => <PharmacyStatusBadge status={p.status} /> },
    {
      key: "verified",
      header: "التحقق",
      render: (p) =>
        p.verified ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
            <ShieldCheck className="h-3.5 w-3.5" /> موثّقة
          </span>
        ) : (
          <span className="text-xs text-ink-faint">غير موثّقة</span>
        ),
    },
    {
      key: "duty",
      header: "المناوبة",
      render: (p) => (p.isOnDutyToday ? <Badge tone="info" dot>مناوبة اليوم</Badge> : <span className="text-xs text-ink-faint">—</span>),
    },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (p) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <Dropdown
            trigger={
              <button className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-muted hover:text-ink" aria-label="إجراءات">
                <MoreVertical className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => router.push(`/pharmacies/${p.id}`)}>
              <Eye className="h-4 w-4" /> عرض التفاصيل
            </DropdownItem>
            {hasPermission("pharmacies.edit") && (
              <DropdownItem onClick={() => router.push(`/pharmacies/${p.id}`)}>
                <Pencil className="h-4 w-4" /> تعديل
              </DropdownItem>
            )}
            {hasPermission("pharmacies.disable") && (
              <DropdownItem
                danger
                onClick={() => {
                  setToDelete(p);
                  confirmDialog.open();
                }}
              >
                <Trash2 className="h-4 w-4" /> تعطيل
              </DropdownItem>
            )}
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الصيدليات"
        description="إدارة كافة الصيدليات المسجّلة على المنصة"
        actions={
          <Link href="/pharmacies/applications">
            <Button variant="outline">طلبات الصيدليات</Button>
          </Link>
        }
      />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث باسم الصيدلية أو الصيدلي أو الهاتف..." className="sm:w-72" />
          <div className="sm:w-44">
            <Select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setPage(1); }}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </div>
          <div className="sm:w-40">
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">كل الحالات</option>
              <option value="approved">مفعّلة</option>
              <option value="pending">قيد المراجعة</option>
              <option value="rejected">مرفوضة</option>
              <option value="disabled">معطّلة</option>
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
        onRowClick={(p) => router.push(`/pharmacies/${p.id}`)}
        emptyTitle="لا توجد صيدليات"
        emptyDescription="لم يتم العثور على صيدليات مطابقة لبحثك أو الفلاتر المحددة."
        pagination={data?.pagination}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={handleDelete}
        title="تعطيل الصيدلية"
        description={`هل أنت متأكد من تعطيل "${toDelete?.name ?? ""}"؟ لن تظهر بعدها للمستخدمين.`}
        confirmLabel="تعطيل"
      />
    </div>
  );
}
