/**
 * Thrown by [ApiClient] for any non-2xx response, or for network-level
 * failures. Mirrors the Laravel error envelope: `{ success: false,
 * message, errors }`. Every caller should catch this specific type
 * rather than a generic Error so field-level messages (422) and status
 * codes can be surfaced properly in forms instead of a raw
 * "AxiosError"/"Failed to fetch" string.
 */
export class ApiError extends Error {
  readonly statusCode: number | null;
  readonly errors: Record<string, string[]>;

  constructor(message: string, statusCode: number | null = null, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }

  get isUnauthenticated() {
    return this.statusCode === 401;
  }
  get isForbidden() {
    return this.statusCode === 403;
  }
  get isValidationError() {
    return this.statusCode === 422;
  }
  get isRateLimited() {
    return this.statusCode === 429;
  }
  get isServerError() {
    return this.statusCode !== null && this.statusCode >= 500;
  }
  get isNetworkError() {
    return this.statusCode === null;
  }

  firstErrorFor(field: string): string | undefined {
    return this.errors[field]?.[0];
  }
}
