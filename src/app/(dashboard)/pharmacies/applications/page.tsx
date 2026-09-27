"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableFilters } from "@/components/tables/TableFilters";
import { SearchInput } from "@/components/forms/SearchInput";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { PharmacyStatusBadge } from "@/features/pharmacies/badges";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listPharmacies, approvePharmacy, rejectPharmacy } from "@/services/pharmacy.service";
import { formatDate } from "@/lib/utils";
import type { Pharmacy } from "@/types/pharmacy";

export default function PharmacyApplicationsPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const [active, setActive] = useState<Pharmacy | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const approveDialog = useDisclosure();
  const rejectDialog = useDisclosure();

  const query = useMemo(() => ({ search: debouncedSearch, status: "pending" as const, page, perPage: 10 }), [debouncedSearch, page]);
  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listPharmacies(query), [query.search, query.page]);

  async function handleApprove() {
    if (!active) return;
    await approvePharmacy(active.id);
    toast.success(`تمت الموافقة على ${active.name}`);
    refetch();
  }

  async function handleReject() {
    if (!active) return;
    await rejectPharmacy(active.id, rejectReason || "لم يتم تحديد سبب");
    toast.success(`تم رفض طلب ${active.name}`);
    setRejectReason("");
    refetch();
  }

  const columns: Column<Pharmacy>[] = [
    { key: "name", header: "اسم الصيدلية", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
    { key: "owner", header: "اسم الصيدلي", render: (p) => p.ownerName },
    { key: "governorate", header: "المحافظة", render: (p) => p.governorate },
    { key: "date", header: "تاريخ الطلب", sortable: true, render: (p) => formatDate(p.createdAt) },
    { key: "status", header: "الحالة", render: (p) => <PharmacyStatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (p) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/pharmacies/${p.id}`)}>
            <Eye className="h-4 w-4" /> عرض
          </Button>
          {hasPermission("pharmacies.approve") && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setActive(p);
                approveDialog.open();
              }}
            >
              <CheckCircle2 className="h-4 w-4" /> قبول
            </Button>
          )}
          {hasPermission("pharmacies.reject") && (
            <Button
              size="sm"
              variant="ghost"
              className="text-danger-500 hover:bg-danger-50"
              onClick={() => {
                setActive(p);
                rejectDialog.open();
              }}
            >
              <XCircle className="h-4 w-4" /> رفض
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="طلبات الصيدليات" description="مراجعة طلبات تسجيل الصيدليات الجديدة قيد الانتظار" />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث باسم الصيدلية أو الصيدلي..." className="sm:w-72" />
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
        emptyTitle="لا توجد طلبات قيد الانتظار"
        emptyDescription="جميع طلبات الصيدليات تمت مراجعتها."
        pagination={data?.pagination}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={approveDialog.isOpen}
        onClose={approveDialog.close}
        onConfirm={handleApprove}
        title="قبول طلب الصيدلية"
        description={`هل تريد الموافقة على طلب "${active?.name ?? ""}"؟`}
        confirmLabel="قبول"
        danger={false}
      />

      <Dialog open={rejectDialog.isOpen} onClose={rejectDialog.close} title="رفض طلب الصيدلية" description={`سبب رفض طلب "${active?.name ?? ""}"`} size="sm">
        <Textarea placeholder="سبب الرفض..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={rejectDialog.close}>إلغاء</Button>
          <Button
            variant="danger"
            onClick={async () => {
              await handleReject();
              rejectDialog.close();
            }}
          >
            تأكيد الرفض
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
