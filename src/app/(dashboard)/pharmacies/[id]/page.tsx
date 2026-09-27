"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Phone, MapPin, ShieldCheck, ShieldOff, Pencil, CheckCircle2, XCircle, Trash2, Moon, Clock, Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton, SkeletonText } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { PharmacyStatusBadge, OpeningStatusBadge } from "@/features/pharmacies/badges";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPharmacy, approvePharmacy, rejectPharmacy, deletePharmacy } from "@/services/pharmacy.service";
import { formatDate, formatTime12 } from "@/lib/utils";
import { WEEKDAY_DISPLAY_ORDER, WEEKDAY_LABELS } from "@/constants/status";

const PharmacyMap = dynamic(() => import("@/features/map/PharmacyMap").then((m) => m.PharmacyMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function PharmacyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const { data: pharmacy, loading, error, errorMessage, refetch } = useApiQuery(() => getPharmacy(params.id), [params.id]);

  const approveDialog = useDisclosure();
  const rejectDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [rejectReason, setRejectReason] = useState("");

  async function handleApprove() {
    await approvePharmacy(params.id);
    toast.success("تمت الموافقة على الصيدلية");
    refetch();
  }

  async function handleReject() {
    await rejectPharmacy(params.id, rejectReason || "لم يتم تحديد سبب");
    toast.success("تم رفض طلب الصيدلية");
    setRejectReason("");
    refetch();
  }

  async function handleDisable() {
    await deletePharmacy(params.id);
    toast.success("تم تعطيل الصيدلية");
    router.push("/pharmacies");
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="تفاصيل الصيدلية" />
        <Card className="p-6">
          <SkeletonText lines={8} />
        </Card>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div>
        <PageHeader title="تفاصيل الصيدلية" />
        <Card>
          <ErrorState title={!pharmacy ? "الصيدلية غير موجودة" : undefined} description={errorMessage ?? undefined} onRetry={refetch} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pharmacy.name}
        description={`${pharmacy.governorate} · ${pharmacy.region}`}
        actions={
          <>
            {hasPermission("pharmacies.edit") && (
              <Button variant="outline" onClick={() => toast.info("سيتم فتح نموذج التعديل")}>
                <Pencil className="h-4 w-4" /> تعديل
              </Button>
            )}
            {pharmacy.status === "pending" && (
              <>
                {hasPermission("pharmacies.approve") && (
                  <Button variant="primary" onClick={approveDialog.open}>
                    <CheckCircle2 className="h-4 w-4" /> قبول
                  </Button>
                )}
                {hasPermission("pharmacies.reject") && (
                  <Button variant="danger" onClick={rejectDialog.open}>
                    <XCircle className="h-4 w-4" /> رفض
                  </Button>
                )}
              </>
            )}
            {hasPermission("pharmacies.disable") && (
              <Button variant="danger" onClick={deleteDialog.open}>
                <Trash2 className="h-4 w-4" /> تعطيل
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الصيدلية</CardTitle>
              <div className="flex items-center gap-2">
                <PharmacyStatusBadge status={pharmacy.status} />
                <OpeningStatusBadge status={pharmacy.openingStatus.key} />
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <InfoRow label="الاسم" value={pharmacy.name} />
                <InfoRow label="الصيدلي المسؤول" value={pharmacy.ownerName ?? "—"} />
                <InfoRow label="الهاتف" value={pharmacy.phone} dir="ltr" icon={Phone} />
                {pharmacy.secondaryPhone && <InfoRow label="هاتف إضافي" value={pharmacy.secondaryPhone} dir="ltr" icon={Phone} />}
                <InfoRow label="المحافظة" value={pharmacy.governorate} />
                <InfoRow label="المنطقة" value={pharmacy.region} />
                <InfoRow label="العنوان" value={pharmacy.address} icon={MapPin} className="sm:col-span-2" />
                <InfoRow
                  label="التحقق"
                  value={pharmacy.verified ? "موثّقة" : "غير موثّقة"}
                  icon={pharmacy.verified ? ShieldCheck : ShieldOff}
                />
                <InfoRow label="تاريخ التسجيل" value={formatDate(pharmacy.createdAt)} icon={Calendar} />
                {pharmacy.approvedAt && <InfoRow label="تاريخ الموافقة" value={formatDate(pharmacy.approvedAt)} icon={Calendar} />}
                {pharmacy.status === "rejected" && pharmacy.rejectionReason && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold text-ink-muted">سبب الرفض</dt>
                    <dd className="mt-1 rounded-xl bg-danger-50 px-3.5 py-2.5 text-sm text-danger-500">{pharmacy.rejectionReason}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أوقات الدوام</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {WEEKDAY_DISPLAY_ORDER.map((day) => {
                    const hours = pharmacy.workingHours.find((h) => h.dayOfWeek === day);
                    return (
                      <tr key={day} className="border-b border-surface-border last:border-0">
                        <td className="px-5 py-3 font-semibold text-ink">{WEEKDAY_LABELS[day]}</td>
                        <td className="px-5 py-3 text-ink-muted">
                          {hours?.enabled && hours.open && hours.close ? (
                            <span>
                              {formatTime12(hours.open)} — {formatTime12(hours.close)}
                            </span>
                          ) : (
                            <Badge tone="neutral">مغلقة</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pharmacy.temporaryClosure && (
                <div className="flex items-center gap-2 border-t border-surface-border bg-amber-50 px-5 py-3 text-xs font-semibold text-amber-600 dark:bg-amber-500/10">
                  <Clock className="h-3.5 w-3.5" />
                  إغلاق مؤقت اليوم من {formatTime12(pharmacy.temporaryClosure.from)} إلى {formatTime12(pharmacy.temporaryClosure.to)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>الموقع</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-52 w-full overflow-hidden rounded-b-2xl">
                <PharmacyMap pharmacies={[pharmacy]} />
              </div>
              <p dir="ltr" className="px-5 py-2.5 text-[11px] text-ink-faint">
                {pharmacy.latitude.toFixed(5)}, {pharmacy.longitude.toFixed(5)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المناوبة</CardTitle>
            </CardHeader>
            <CardContent>
              {pharmacy.dutySchedules.length === 0 ? (
                <p className="text-sm text-ink-faint">لا توجد مناوبات مجدولة حاليًا.</p>
              ) : (
                <ul className="space-y-2.5">
                  {pharmacy.dutySchedules.map((duty) => (
                    <li key={duty.id} className="flex items-center gap-2.5 rounded-xl bg-surface-muted px-3.5 py-2.5">
                      <Moon className="h-4 w-4 shrink-0 text-brand-600" />
                      <div className="text-sm">
                        <p className="font-semibold text-ink">{formatDate(duty.date)}</p>
                        <p className="text-xs text-ink-muted">
                          {formatTime12(duty.from)} ← {formatTime12(duty.to)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={approveDialog.isOpen}
        onClose={approveDialog.close}
        onConfirm={handleApprove}
        title="قبول طلب الصيدلية"
        description={`هل تريد الموافقة على "${pharmacy.name}"؟ ستصبح مرئية للمستخدمين فور القبول.`}
        confirmLabel="قبول"
        danger={false}
      />

      <Dialog open={rejectDialog.isOpen} onClose={rejectDialog.close} title="رفض طلب الصيدلية" description="يرجى توضيح سبب الرفض ليتمكن الصيدلي من تصحيحه." size="sm">
        <Textarea placeholder="سبب الرفض..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={rejectDialog.close}>إلغاء</Button>
          <Button
            variant="danger"
            onClick={async () => {
              await handleReject();
              rejectDialog.close();
            }}
          >
            تأكيد الرفض
          </Button>
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDisable}
        title="تعطيل الصيدلية"
        description={`هل أنت متأكد من تعطيل "${pharmacy.name}"؟ لن تظهر بعدها للمستخدمين.`}
        confirmLabel="تعطيل"
      />
    </div>
  );
}

function InfoRow({
  label, value, icon: Icon, dir, className,
}: { label: string; value: string; icon?: React.ComponentType<{ className?: string }>; dir?: "ltr" | "rtl"; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink" dir={dir}>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-ink-faint" />}
        {value}
      </dd>
    </div>
  );
}
