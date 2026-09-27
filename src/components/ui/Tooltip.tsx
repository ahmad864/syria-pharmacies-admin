"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({ content, children, side = "top" }: { content: string; children: ReactNode; side?: "top" | "bottom" }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-surface shadow-popover animate-fade-in",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
