"use client";

import { Calendar } from "lucide-react";

export interface DateRange {
  from: string; // yyyy-mm-dd
  to: string; // yyyy-mm-dd
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-raised px-3 py-1.5">
      <Calendar className="h-4 w-4 shrink-0 text-ink-faint" />
      <input
        type="date"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        className="w-[124px] bg-transparent text-xs text-ink focus:outline-none"
        aria-label="من تاريخ"
      />
      <span className="text-ink-faint">—</span>
      <input
        type="date"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        className="w-[124px] bg-transparent text-xs text-ink focus:outline-none"
        aria-label="إلى تاريخ"
      />
    </div>
  );
}
