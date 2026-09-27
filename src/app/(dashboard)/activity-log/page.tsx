"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableFilters } from "@/components/tables/TableFilters";
import { SearchInput } from "@/components/forms/SearchInput";
import { DateRangePicker, type DateRange } from "@/components/forms/DateRangePicker";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useApiQuery } from "@/hooks/useApiQuery";
import { listActivityLog } from "@/services/activity.service";
import type { ActivityLogEntry } from "@/types/activity";
import { formatDateTime } from "@/lib/utils";

/**
 * Backend action slugs are "domain.verb" (e.g. "pharmacy.approve") and are
 * not a fixed closed set — this maps common verbs found within the slug
 * to a badge tone rather than requiring an exact-match union, so a newly
 * added action type (see App\Services\ActivityLogger call sites) never
 * silently falls through untyped.
 */
function toneForAction(action: string): "success" | "danger" | "brand" | "neutral" | "amber" {
  if (action.includes("approve") || action.includes("enable")) return "success";
  if (action.includes("reject") || action.includes("delete") || action.includes("disable")) return "danger";
  if (action.includes("create") || action.includes("send")) return "brand";
  if (action.includes("update")) return "amber";
  return "neutral";
}

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const debouncedSearch = useDebouncedValue(search);

  const query = useMemo(() => ({ search: debouncedSearch, from: range.from || undefined, to: range.to || undefined, page, perPage: 12 }), [debouncedSearch, range, page]);
  const { data, loading, error, errorMessage, refetch } = useApiQuery(() => listActivityLog(query), [query.search, query.from, query.to, query.page]);

  const columns: Column<ActivityLogEntry>[] = [
    {
      key: "admin",
      header: "المدير",
      render: (a) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
            {a.adminName.slice(0, 1)}
          </div>
          <span className="font-semibold text-ink">{a.adminName}</span>
        </div>
      ),
    },
    { key: "action", header: "العملية", render: (a) => <Badge tone={toneForAction(a.action)} dot>{a.actionLabel}</Badge> },
    { key: "target", header: "العنصر", render: (a) => a.targetLabel },
    { key: "date", header: "التاريخ والوقت", sortable: true, render: (a) => formatDateTime(a.createdAt) },
    { key: "details", header: "التفاصيل", render: (a) => <span className="text-xs text-ink-muted">{a.details}</span> },
  ];

  return (
    <div>
      <PageHeader title="سجل النشاط" description="سجل كامل لكافة العمليات التي قام بها مديرو النظام" />

      <div className="mb-4">
        <TableFilters>
          <SearchInput value={search} onChange={setSearch} placeholder="ابحث باسم المدير أو العنصر..." className="sm:w-72" />
          <DateRangePicker value={range} onChange={setRange} />
        </TableFilters>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        getRowId={(a) => a.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا توجد نشاطات"
        pagination={data?.pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
