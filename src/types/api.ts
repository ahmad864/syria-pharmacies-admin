/**
 * Generic pagination types shared by every paginated list page, mirroring
 * Laravel's `{ items, pagination: {current_page, last_page, per_page,
 * total} }` shape (mapped to camelCase in src/lib/api-mappers.ts).
 *
 * The raw `{success, message, data}` / `{success, message, errors}`
 * envelope itself is unwrapped once, centrally, inside `ApiClient`
 * (src/lib/api-client.ts) — services and pages only ever see the
 * unwrapped `data` or a thrown `ApiError` (src/lib/api-error.ts), so no
 * separate envelope type is needed here.
 */

export interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

/** Common query shape for any paginated, searchable, filterable list page. */
export interface ListQuery {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
