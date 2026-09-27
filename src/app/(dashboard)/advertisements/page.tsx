"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, MoreVertical, Trash2, PlayCircle, PauseCircle, Eye, MousePointerClick, ImagePlus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { listAdvertisements, toggleAdvertisement, deleteAdvertisement, createAdvertisement } from "@/services/advertisement.service";
import type { Advertisement } from "@/types/advertisement";
import { AD_STATUS_LABEL } from "@/constants/status";
import { formatDate, formatNumber } from "@/lib/utils";
import { ApiError } from "@/lib/api-error";

const STATUS_TONE: Record<Advertisement["status"], "success" | "info" | "neutral" | "danger"> = {
  active: "success", scheduled: "info", expired: "neutral", disabled: "danger",
};

export default function AdvertisementsPage() {
  const { hasPermission } = useAuth();
  const { data, loading, error, errorMessage, refetch } = useApiQuery(listAdvertisements);
  const [target, setTarget] = useState<Advertisement | null>(null);
  const createDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleToggle(ad: Advertisement) {
    const next = ad.status === "active" ? "disabled" : "active";
    try {
      await toggleAdvertisement(ad.id, next);
      toast.success(next === "active" ? `تم تفعيل إعلان "${ad.title}"` : `تم تعطيل إعلان "${ad.title}"`);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "تعذّر تنفيذ العملية");
    }
  }

  async function handleDelete() {
    if (!target) return;
    await deleteAdvertisement(target.id);
    toast.success(`تم حذف إعلان "${target.title}"`);
    refetch();
  }

  function resetForm() {
    setTitle("");
    setLinkUrl("");
    setStartDate("");
    setEndDate("");
    setImageFile(null);
    setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCreate() {
    if (!imageFile) {
      setFormError("يرجى اختيار صورة للإعلان");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createAdvertisement({ title, image: imageFile, linkUrl: linkUrl || undefined, startDate, endDate });
      toast.success("تمت إضافة الإعلان");
      resetForm();
      createDialog.close();
      refetch();
    } catch (err) {
      setFormError(err instanceof ApiError ? (err.firstErrorFor("image") ?? err.firstErrorFor("title") ?? err.message) : "تعذّر إضافة الإعلان");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<Advertisement>[] = [
    {
      key: "ad",
      header: "الإعلان",
      render: (ad) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            {ad.imageUrl && <Image src={ad.imageUrl} alt={ad.title} fill sizes="64px" className="object-cover" unoptimized />}
          </div>
          <span className="font-semibold text-ink">{ad.title}</span>
        </div>
      ),
    },
    { key: "status", header: "الحالة", render: (ad) => <Badge tone={STATUS_TONE[ad.status]} dot>{AD_STATUS_LABEL[ad.status]}</Badge> },
    { key: "start", header: "تاريخ البداية", render: (ad) => formatDate(ad.startDate) },
    { key: "end", header: "تاريخ النهاية", render: (ad) => formatDate(ad.endDate) },
    {
      key: "views",
      header: "المشاهدات",
      render: (ad) => (
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {formatNumber(ad.views)}</span>
          <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {formatNumber(ad.clicks)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      className: "text-end",
      headerClassName: "text-end",
      render: (ad) =>
        !hasPermission("ads.edit") && !hasPermission("ads.delete") ? (
          <span className="block text-end text-xs text-ink-faint">—</span>
        ) : (
          <div className="flex justify-end">
            <Dropdown
              trigger={
                <button className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-muted hover:text-ink" aria-label="إجراءات">
                  <MoreVertical className="h-4 w-4" />
                </button>
              }
            >
              {hasPermission("ads.edit") && (
                <DropdownItem onClick={() => handleToggle(ad)}>
                  {ad.status === "active" ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {ad.status === "active" ? "تعطيل" : "تفعيل"}
                </DropdownItem>
              )}
              {hasPermission("ads.delete") && (
                <DropdownItem
                  danger
                  onClick={() => {
                    setTarget(ad);
                    deleteDialog.open();
                  }}
                >
                  <Trash2 className="h-4 w-4" /> حذف
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الإعلانات"
        description="إدارة الإعلانات الترويجية المعروضة في الشاشة الرئيسية لتطبيق الصيدليات"
        actions={
          hasPermission("ads.create") && (
            <Button onClick={createDialog.open}>
              <Plus className="h-4 w-4" /> إضافة إعلان
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        getRowId={(ad) => ad.id}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={refetch}
        emptyTitle="لا توجد إعلانات"
        emptyDescription="لم تتم إضافة أي إعلانات بعد."
      />

      <Dialog open={createDialog.isOpen} onClose={() => { resetForm(); createDialog.close(); }} title="إضافة إعلان جديد" size="md">
        {formError && (
          <div className="mb-4 rounded-xl bg-danger-50 px-3.5 py-2.5 text-xs font-semibold text-danger-500">{formError}</div>
        )}
        <div className="space-y-4">
          <Input label="عنوان الإعلان" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: عرض خاص على الفيتامينات" />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-muted">صورة الإعلان</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-surface-border bg-surface-muted text-ink-muted transition-colors hover:border-brand-400"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-semibold">{imageFile ? imageFile.name : "اضغط لاختيار صورة"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <Input label="رابط الإعلان (اختياري)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://" dir="ltr" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="تاريخ البداية" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="تاريخ النهاية" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => { resetForm(); createDialog.close(); }} disabled={submitting}>إلغاء</Button>
          <Button onClick={handleCreate} loading={submitting} disabled={!title.trim() || !startDate || !endDate}>
            حفظ الإعلان
          </Button>
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="حذف الإعلان"
        description={`هل أنت متأكد من حذف إعلان "${target?.title ?? ""}"؟`}
        confirmLabel="حذف"
      />
    </div>
  );
}
