"use client";

import { useEffect, useState, useCallback } from "react";
import { ApiError } from "@/lib/api-error";

interface ApiQueryState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
  /** The real message from Laravel (via ApiError) when available, so ErrorState can show something more useful than a generic string. */
  errorMessage: string | null;
  refetch: () => void;
}

/**
 * Thin async-state wrapper used by every page to call its `*.service.ts`
 * function, which in turn calls the real Laravel API through ApiClient.
 * Surfaces the real error message from a thrown `ApiError` (e.g. "لم يتم
 * العثور على العنصر") instead of a generic "حدث خطأ" whenever the backend
 * provided one.
 */
export function useApiQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []): ApiQueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setErrorMessage(null);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(true);
        setErrorMessage(err instanceof ApiError ? err.message : null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  useEffect(() => load(), [load]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, errorMessage, refetch };
}
