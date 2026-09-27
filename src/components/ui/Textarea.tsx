import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const areaId = id ?? label?.replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-xs font-semibold text-ink-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={cn(
            "min-h-[96px] w-full rounded-xl border bg-surface-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            error ? "border-danger-500" : "border-surface-border focus:border-brand-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
