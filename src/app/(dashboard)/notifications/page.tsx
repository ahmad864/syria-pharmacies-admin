"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Eye, Send, ImagePlus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listNotifications, sendNotification } from "@/services/notification.service";
import type { AdminNotification } from "@/types/notification";
import { formatDateTime } from "@/lib/utils";
import { ApiError } from "@/lib/api-error";

/**
 * Deliberately scoped down per the brief: every notification here is
 * sent to ALL users, no audience targeting — matching what the backend
 * (App\Http\Controllers\Api\V1\Admin\NotificationController) actually
 * supports. There is no delete action because no DELETE endpoint exists
 * for sent notifications (a durable send log is intentionally
 * append-only).
 */
export default function NotificationsPage() {
  const { hasPermission } = useAuth();
  const { data, loading, error, errorMessage, refetch } = useApiQuery(listNotifications);
  const [target, setTarget] = useState<AdminNotification | null>(null);
  const composeDialog = useDisclosure();
  const viewDialog = useDisclosure();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setTitle("");
    setBody("");
    setImageFile(null);
    setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSend() {
    setSending(true);
    setFormError(null);
    try {
      await sendNotification({ title, body, image: imageFile ?? undefined });
      toast.success("تم إرسال الإشعار بنجاح لجميع المستخدمين");
      resetForm();
      composeDialog.close();
      refetch();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "تعذّر إرسال الإشعار");
    } finally {
      setSending(false);
    }
  }

  const columns: Column<AdminNotification>[] = [
    { key: "title", header: "عنوان الإشعار", render: (n) => <span className="font-semibold text-ink">{n.title}</span> },
    {
      key: "recipient",
      header: "المستلم",
      render: (n) => (
        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
          <Users className="h-3.5 w-3.5" /> {n.recipientLabel}
        </span>
      ),
    },
    { key: "status", header: "الحالة", render: () => <Badge tone="success" dot>تم الإرسال</Badge> },
    { key: "date", header: "التاريخ", render: (n) => formatDateTime(n.sentAt ?? n.createdAt) },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (n) => (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => { setTarget(n); viewDialog.open(); }}>
            <Eye className="h-4 w-4" /> عرض
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الإشعارات"
        description="إرسال إشعارات لجميع مستخدمي التطبيق ومتابعة سجل الإرسال"
        actions={
          hasPermission("notifications.send") && (
            <Button onClick={composeDialog.open}>
              <Plus className="h-4 w-4" /> إرسال إشعار
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        getRowId={(n) => n.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا توجد إشعارات مرسلة بعد"
      />

      <Dialog open={composeDialog.isOpen} onClose={() => { resetForm(); composeDialog.close(); }} title="إرسال إشعار جديد" size="md">
        {formError && (
          <div className="mb-4 rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{formError}</div>
        )}
        <div className="space-y-4">
          <div className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            سيُرسل هذا الإشعار لجميع مستخدمي التطبيق.
          </div>
          <Input label="عنوان الإشعار" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea label="نص الإشعار" value={body} onChange={(e) => setBody(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-muted">صورة (اختياري)</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-surface-border bg-surface-muted text-ink-muted transition-colors hover:border-brand-400"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="text-xs font-semibold">{imageFile ? imageFile.name : "اضغط لاختيار صورة"}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => { resetForm(); composeDialog.close(); }} disabled={sending}>إلغاء</Button>
          <Button onClick={handleSend} loading={sending} disabled={!title.trim() || !body.trim()}>
            <Send className="h-4 w-4" /> إرسال
          </Button>
        </div>
      </Dialog>

      <Dialog open={viewDialog.isOpen} onClose={viewDialog.close} title={target?.title ?? ""} size="sm">
        <p className="text-sm leading-7 text-ink-muted">{target?.body}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
          <span>المستلم: {target?.recipientLabel}</span>
          <span>·</span>
          <span>{target && formatDateTime(target.sentAt ?? target.createdAt)}</span>
        </div>
      </Dialog>
    </div>
  );
}
