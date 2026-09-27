import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "amber" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-muted",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  success: "bg-success-50 text-success-600 dark:bg-success-500/10",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  danger: "bg-danger-50 text-danger-600 dark:bg-danger-500/10",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}