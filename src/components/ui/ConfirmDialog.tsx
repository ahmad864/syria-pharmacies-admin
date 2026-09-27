"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
}

/**
 * Confirmation → action → loading → close flow, used for every destructive
 * or state-changing action across the dashboard (delete, approve, reject,
 * disable...). The caller's `onConfirm` is currently a mock action (see
 * src/services) — swap it for a real API call later without touching this
 * component.
 */
export function ConfirmDialog({
  open, onClose, onConfirm, title, description, confirmLabel = "تأكيد", danger = true,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3">
        <div className={danger ? "rounded-full bg-danger-50 p-2 text-danger-500" : "rounded-full bg-brand-50 p-2 text-brand-600"}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="pt-1 text-sm text-ink-muted">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
