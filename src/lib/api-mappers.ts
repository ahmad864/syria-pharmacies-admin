import type { Pagination } from "@/types/api";

interface RawPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Converts Laravel's snake_case pagination object to the dashboard's camelCase `Pagination`. */
export function mapPagination(raw: RawPagination): Pagination {
  return {
    currentPage: raw.current_page,
    lastPage: raw.last_page,
    perPage: raw.per_page,
    total: raw.total,
  };
}
