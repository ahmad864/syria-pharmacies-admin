import { API_BASE_URL } from "./api-config";
import { ApiError } from "./api-error";
import { getSessionToken, clearSessionToken } from "./session";

type QueryValue = string | number | boolean | undefined | null;

/**
 * Central, single HTTP client for the whole dashboard (brief section 16:
 * "Page → Hook/Service → API Client → Laravel", never `fetch()` directly
 * inside a component or page). Mirrors the Flutter app's `ApiClient`:
 * attaches the Bearer token automatically, unwraps Laravel's
 * `{success, message, data}` / `{success, message, errors}` envelope,
 * and converts every non-2xx response into a single `ApiError` type so
 * callers never see a raw "Failed to fetch" string.
 */
class ApiClient {
  /** Fired once per 401, in addition to the thrown ApiError — see AuthProvider. */
  onUnauthenticated: (() => void) | null = null;

  async get<T>(path: string, query?: Record<string, QueryValue>): Promise<T> {
    return this.send<T>("GET", path, { query });
  }
  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.send<T>("POST", path, { body });
  }
  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.send<T>("PUT", path, { body });
  }
  async delete<T>(path: string): Promise<T> {
    return this.send<T>("DELETE", path);
  }

  /** For multipart uploads (advertisement/notification images) — same envelope handling as JSON calls. */
  async postForm<T>(path: string, form: FormData): Promise<T> {
    return this.send<T>("POST", path, { form });
  }
  async putForm<T>(path: string, form: FormData): Promise<T> {
    // Laravel doesn't parse multipart PUT bodies reliably from all HTTP
    // clients — the standard workaround is POST + `_method=PUT` spoofing,
    // which Laravel's MethodOverride middleware honors natively.
    form.append("_method", "PUT");
    return this.send<T>("POST", path, { form });
  }

  private async send<T>(
    method: string,
    path: string,
    opts: { query?: Record<string, QueryValue>; body?: unknown; form?: FormData } = {}
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);
    if (opts.query) {
      for (const [key, value] of Object.entries(opts.query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = { Accept: "application/json" };
    const token = getSessionToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let body: BodyInit | undefined;
    if (opts.form) {
      body = opts.form; // browser sets multipart Content-Type + boundary automatically
    } else if (opts.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), { method, headers, body });
    } catch {
      throw new ApiError("تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت والمحاولة لاحقًا.");
    }

    return this.parse<T>(response);
  }

  private async parse<T>(response: Response): Promise<T> {
    let json: unknown = {};
    try {
      const text = await response.text();
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError("استجابة غير صالحة من الخادم", response.status);
    }

    const envelope = json as { success?: boolean; message?: string; data?: T; errors?: Record<string, string[]> | null };

    if (response.ok && envelope.success) {
      return envelope.data as T;
    }

    if (response.status === 401) {
      clearSessionToken();
      apiClient.onUnauthenticated?.();
    }

    throw new ApiError(
      envelope.message || this.defaultMessageFor(response.status),
      response.status,
      envelope.errors ?? {}
    );
  }

  private defaultMessageFor(status: number): string {
    switch (status) {
      case 403:
        return "ليست لديك الصلاحية اللازمة لتنفيذ هذا الإجراء";
      case 404:
        return "العنصر المطلوب غير موجود";
      case 422:
        return "خطأ في التحقق من البيانات المدخلة";
      case 429:
        return "عدد كبير جدًا من الطلبات، حاول لاحقًا";
      case 500:
      case 502:
      case 503:
        return "حدث خطأ في الخادم، يرجى المحاولة لاحقًا";
      default:
        return "حدث خطأ غير متوقع";
    }
  }
}

export const apiClient = new ApiClient();
