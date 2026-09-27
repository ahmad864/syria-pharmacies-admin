"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { SidebarContent } from "./Sidebar";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 w-[280px] max-w-[85vw] animate-slide-in-from-start border-e border-surface-border bg-surface-raised shadow-popover">
        <button
          onClick={onClose}
          aria-label="إغلاق القائمة"
          className="absolute end-3 top-4 rounded-lg p-1.5 text-ink-faint hover:bg-surface-muted"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>,
    document.body
  );
}
