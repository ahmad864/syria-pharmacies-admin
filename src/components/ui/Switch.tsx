"use client";

import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

/**
 * Uses absolute positioning with logical inset (start/end) instead of a
 * transform-based slide, so it's correct under `dir="rtl"` without needing
 * separate `rtl:` overrides.
 */
export function Switch({ checked, onChange, disabled, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        checked ? "bg-brand-500" : "bg-surface-border",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <span
        className={cn(
          "absolute h-[18px] w-[18px] rounded-full bg-white shadow transition-[inset-inline-start]",
          checked ? "start-[22px]" : "start-1"
        )}
      />
    </button>
  );
}
