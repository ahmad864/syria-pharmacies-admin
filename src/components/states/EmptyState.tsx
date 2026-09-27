import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "لا توجد بيانات",
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="rounded-2xl bg-surface-muted p-4 text-ink-faint">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        {description && <p className="mt-1 max-w-sm text-xs text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
