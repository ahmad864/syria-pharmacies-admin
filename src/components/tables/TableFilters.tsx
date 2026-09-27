import type { ReactNode } from "react";

/** Simple flex/wrap container so every list page's filter bar (search + selects + date range) looks consistent. */
export function TableFilters({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}
