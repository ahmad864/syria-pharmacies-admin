"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "بحث...", className }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-surface-border bg-surface-raised ps-9 pe-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="مسح البحث"
          className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-faint hover:bg-surface-muted hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
