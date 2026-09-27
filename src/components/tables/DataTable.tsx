"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonTable } from "@/components/states/Skeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { TablePagination } from "./TablePagination";
import type { Pagination } from "@/types/api";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
}

/**
 * Generic, headless-ish data table shared by every list page (pharmacies,
 * pharmacists, users, applications, duties, advertisements, notifications,
 * activity log...). Pages only supply `columns` + `data` — sorting/loading/
 * empty/error/pagination chrome is handled once, here.
 */
export function DataTable<T>({
  columns, data, getRowId, loading, error, errorMessage, onRetry,
  emptyTitle, emptyDescription, onRowClick, sortBy, sortDir, onSort,
  pagination, onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-raised shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-start text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("whitespace-nowrap px-5 py-3 text-start text-xs font-bold text-ink-muted", col.headerClassName)}
                >
                  {col.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 transition-colors hover:text-ink"
                      onClick={() => onSort?.(col.key)}
                    >
                      {col.header}
                      {sortBy === col.key ? (
                        sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {!loading && !error && data.length > 0 && (
            <tbody>
              {data.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-surface-border last:border-0 transition-colors hover:bg-surface-muted/60",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-5 py-3.5 align-middle text-ink", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {loading && <SkeletonTable cols={columns.length} />}
      {!loading && error && <ErrorState description={errorMessage ?? undefined} onRetry={onRetry} />}
      {!loading && !error && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
      {!loading && !error && data.length > 0 && pagination && pagination.total > 0 && onPageChange && (
        <TablePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
