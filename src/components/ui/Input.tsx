import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-ink-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-xl border bg-surface-raised px-3.5 text-sm text-ink placeholder:text-ink-faint",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            error ? "border-danger-500 focus:border-danger-500" : "border-surface-border focus:border-brand-500",
            props.disabled && "bg-surface-muted text-ink-faint",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
