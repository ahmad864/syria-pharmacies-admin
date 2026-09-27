import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Reusable error UI. Not wired to any real Laravel error yet — `onRetry`
 * is a plain callback the caller provides (e.g. re-running a mock fetch).
 */
export function ErrorState({ title = "حدث خطأ", description = "تعذّر تحميل البيانات، يرجى المحاولة مرة أخرى.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="rounded-2xl bg-danger-50 p-4 text-danger-500">
        <AlertOctagon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="mt-1 max-w-sm text-xs text-ink-muted">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          حاول مرة أخرى
        </Button>
      )}
    </div>
  );
}
