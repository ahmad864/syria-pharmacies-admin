"use client";

import { useMemo, useState } from "react";
import { Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableFilters } from "@/components/tables/TableFilters";
import { SearchInput } from "@/components/forms/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useApiQuery } from "@/hooks/useApiQuery";
import { listDuties } from "@/services/duty.service";
import { GOVERNORATES } from "@/types/pharmacy";
import type { DutyEntry } from "@/types/duty";
import { formatTime12 } from "@/lib/utils";

/** Matches PharmacyDutyResource.day_of_week (1 = Monday .. 7 = Sunday). */
const WEEKDAYS = [
  { value: 1, label: "الاثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
  { value: 7, label: "الأحد" },
];

export default function DutyPharmaciesPage() {
  const [search, setSearch] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const query = useMemo(
    () => ({
      search: debouncedSearch,
      governorate: governorate || undefined,
      dayOfWeek: dayOfWeek ? Number(dayOfWeek) : undefined,
      page,
      perPage: 10,
    }),
    [debouncedSearch, governorate, dayOfWeek, page]
  );
  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listDuties(query), [query.search, query.governorate, query.dayOfWeek, query.page]);

  const columns: Column<DutyEntry>[] = [
    {
      key: "pharmacy",
      header: "الصيدلية",
      render: (d) => (
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 shrink-0 text-brand-600" />
          <span className="font-semibold text-ink">{d.pharmacyName}</span>
        </div>
      ),
    },
    { key: "governorate", header: "المحافظة", render: (d) => d.governorate },
    { key: "region", header: "المنطقة", render: (d) => d.region },
    { key: "day", header: "اليوم", sortable: true, render: (d) => d.dayName },
    { key: "from", header: "من", render: (d) => formatTime12(d.from) },
    { key: "to", header: "إلى", render: (d) => formatTime12(d.to) },
    { key: "status", header: "الحالة", render: (d) => <Badge tone={d.status === "scheduled" ? "info" : "neutral"} dot>{d.status === "scheduled" ? "مجدولة" : "ملغاة"}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="صيدليات المناوبة" description="جدول المناوبات الأسبوعية المتكررة للصيدليات" />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث باسم الصيدلية..." className="sm:w-64" />
          <div className="sm:w-44">
            <Select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setPage(1); }}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </div>
          <div className="sm:w-44">
            <Select value={dayOfWeek} onChange={(e) => { setDayOfWeek(e.target.value); setPage(1); }}>
              <option value="">كل الأيام</option>
              {WEEKDAYS.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </Select>
          </div>
        </TableFilters>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        getRowId={(d) => d.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا توجد مناوبات"
        emptyDescription="لا توجد صيدليات مناوبة مطابقة للفلاتر المحددة."
        pagination={data?.pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
