import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn, formatNumber } from "@/lib/utils";

export interface StatisticsCardProps {
  label: string;
  value: number;
  delta?: number;
  trend?: "up" | "down" | "flat";
  icon: LucideIcon;
  tone?: "brand" | "amber" | "success" | "danger";
}

const toneClasses = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  success: "bg-success-50 text-success-600 dark:bg-success-500/10",
  danger: "bg-danger-50 text-danger-500 dark:bg-danger-500/10",
};

export function StatisticsCard({ label, value, delta, trend = "flat", icon: Icon, tone = "brand" }: StatisticsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-ink-muted">{label}</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-ink">{formatNumber(value)}</p>
        </div>
        <div className={cn("rounded-xl p-2.5", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
          {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-success-500" />}
          {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-danger-500" />}
          {trend === "flat" && <Minus className="h-3.5 w-3.5 text-ink-faint" />}
          <span className={trend === "up" ? "text-success-500" : trend === "down" ? "text-danger-500" : "text-ink-faint"}>
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
          <span className="font-normal text-ink-faint">مقارنة بالشهر الماضي</span>
        </div>
      )}
    </Card>
  );
}
