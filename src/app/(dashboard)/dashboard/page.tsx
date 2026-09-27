"use client";

import Link from "next/link";
import { Store, CheckCircle2, FileClock, Stethoscope, Users, Moon, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatisticsCard } from "@/components/charts/StatisticsCard";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard, SkeletonText } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useApiQuery } from "@/hooks/useApiQuery";
import { getDashboardSummary } from "@/services/dashboard.service";
import { formatDateTime } from "@/lib/utils";

const STAT_ICONS = [Store, CheckCircle2, FileClock, Store, Stethoscope, Users, Moon] as const;
const STAT_TONES = ["brand", "success", "amber", "danger", "brand", "brand", "amber"] as const;

export default function DashboardPage() {
  const { data, loading, error, errorMessage, refetch } = useApiQuery(getDashboardSummary);

  return (
    <div>
      <PageHeader title="لوحة التحكم" description="نظرة عامة على أداء منصة صيدليات سوريا" />

      {error && <ErrorState description={errorMessage ?? undefined} onRetry={refetch} />}

      {!error && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {loading || !data
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : data.stats.map((stat, i) => (
                  <StatisticsCard
                    key={stat.id}
                    label={stat.label}
                    value={stat.value}
                    delta={stat.delta}
                    trend={stat.trend}
                    icon={STAT_ICONS[i] ?? Store}
                    tone={STAT_TONES[i] ?? "brand"}
                  />
                ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>نمو الصيدليات</CardTitle>
                  <CardDescription>عدد الصيدليات المسجّلة في آخر ٦ أشهر</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {loading || !data ? <SkeletonText lines={6} /> : <LineChart data={data.pharmacyTrend} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>الصيدليات حسب المحافظة</CardTitle>
                  <CardDescription>التوزيع الحالي الفعلي</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {loading || !data ? (
                  <SkeletonText lines={6} />
                ) : data.governorateBreakdown.length === 0 ? (
                  <EmptyState title="لا توجد بيانات كافية" />
                ) : (
                  <BarChart data={data.governorateBreakdown} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>نمو المستخدمين</CardTitle>
                  <CardDescription>عدد المستخدمين الجدد في آخر ٦ أشهر</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {loading || !data ? <SkeletonText lines={6} /> : <LineChart data={data.userTrend} color="#C9971F" />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>طلبات الصيدليات الأخيرة</CardTitle>
                <Link href="/pharmacies/applications" className="text-xs font-semibold text-brand-600 hover:underline">
                  عرض الكل
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {loading || !data ? (
                  <div className="p-5">
                    <SkeletonText lines={5} />
                  </div>
                ) : data.recentApplications.length === 0 ? (
                  <EmptyState title="لا توجد طلبات حالية" />
                ) : (
                  <ul>
                    {data.recentApplications.map((app) => (
                      <li key={app.id} className="flex items-center justify-between gap-3 border-b border-surface-border px-5 py-3.5 last:border-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{app.name}</p>
                          <p className="text-xs text-ink-muted">{app.governorate} · {app.ownerName ?? "—"}</p>
                        </div>
                        <Badge tone="amber">قيد المراجعة</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>آخر النشاطات</CardTitle>
              <Link href="/activity-log" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
                سجل النشاط الكامل
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loading || !data ? (
                <div className="p-5">
                  <SkeletonText lines={5} />
                </div>
              ) : data.recentActivity.length === 0 ? (
                <EmptyState title="لا توجد نشاطات مسجّلة بعد" />
              ) : (
                <ul>
                  {data.recentActivity.map((entry) => (
                    <li key={entry.id} className="flex items-center gap-3 border-b border-surface-border px-5 py-3.5 last:border-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                        {entry.adminName.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">
                          <span className="font-semibold">{entry.adminName}</span> {entry.actionLabel}
                          {entry.targetLabel ? ` — ${entry.targetLabel}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-ink-faint">{formatDateTime(entry.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
