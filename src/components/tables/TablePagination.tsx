"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { Pagination } from "@/types/api";

export interface TablePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function TablePagination({ pagination, onPageChange }: TablePaginationProps) {
  const { currentPage, lastPage, total, perPage } = pagination;
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-surface-border px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-ink-muted">
        عرض <span className="font-semibold text-ink">{formatNumber(from)}</span>–
        <span className="font-semibold text-ink">{formatNumber(to)}</span> من{" "}
        <span className="font-semibold text-ink">{formatNumber(total)}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-faint">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-colors",
                p === currentPage ? "bg-brand-500 text-white" : "text-ink-muted hover:bg-surface-muted"
              )}
            >
              {formatNumber(p)}
            </button>
          </span>
        ))}
        <button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
