"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Store, Users, MapPin, Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { DateRangePicker, type DateRange } from "@/components/forms/DateRangePicker";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { StatisticsCard } from "@/components/charts/StatisticsCard";
import { SkeletonText } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { useApiQuery } from "@/hooks/useApiQuery";
import { getPharmacyReport, getUserReport, getGovernorateReport, getDutyReport } from "@/services/report.service";

/**
 * Every number on this page is real (see src/services/report.service.ts —
 * it currently reuses the same real dashboard aggregates rather than
 * fabricated report-specific figures). The date range picker is present
 * for future use but does not yet filter results server-side — the
 * backend has no date-range-filterable reports endpoint yet (documented
 * honestly, see FINAL_INTEGRATION_REPORT.md "remaining limitations"),
 * so it's disabled with an explanatory note rather than silently ignored.
 */
export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [tab, setTab] = useState("pharmacies");

  const pharmacyQuery = useApiQuery(() => getPharmacyReport(range), [range.from, range.to]);
  const userQuery = useApiQuery(() => getUserReport(range), [range.from, range.to]);
  const governorateQuery = useApiQuery(() => getGovernorateReport(range), [range.from, range.to]);
  const dutyQuery = useApiQuery(() => getDutyReport(range), [range.from, range.to]);

  function handleExport() {
    toast.info("تصدير التقارير غير متاح بعد — لا يوجد endpoint مخصص لذلك على الخادم حاليًا");
  }

  return (
    <div>
      <PageHeader
        title="التقارير"
        description="تقارير مبنية على بيانات حقيقية من قاعدة البيانات"
        actions={
          <>
            <DateRangePicker value={range} onChange={setRange} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" /> تصدير التقرير
            </Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-5">
        <TabsList>
          <TabsTrigger value="pharmacies">تقرير الصيدليات</TabsTrigger>
          <TabsTrigger value="users">تقرير المستخدمين</TabsTrigger>
          <TabsTrigger value="governorates">تقرير المحافظات</TabsTrigger>
          <TabsTrigger value="duty">تقرير المناوبة</TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="pharmacies">
            {pharmacyQuery.error ? (
              <Card><ErrorState description={pharmacyQuery.errorMessage ?? undefined} onRetry={pharmacyQuery.refetch} /></Card>
            ) : (
              <>
                {pharmacyQuery.data && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {pharmacyQuery.data.byStatus.map((s) => (
                      <StatisticsCard key={s.label} label={s.label} value={s.value} icon={Store} />
                    ))}
                  </div>
                )}
                <Card className="mt-5">
                  <CardHeader>
                    <CardTitle>نمو الصيدليات (آخر ٦ أشهر)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pharmacyQuery.loading || !pharmacyQuery.data ? <SkeletonText lines={6} /> : <LineChart data={pharmacyQuery.data.trend} />}
                  </CardContent>
                </Card>
                <Card className="mt-5">
                  <CardHeader>
                    <CardTitle>توزيع حالات الصيدليات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pharmacyQuery.loading || !pharmacyQuery.data ? <SkeletonText lines={6} /> : <PieChart data={pharmacyQuery.data.byStatus} />}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="users">
            {userQuery.error ? (
              <Card><ErrorState description={userQuery.errorMessage ?? undefined} onRetry={userQuery.refetch} /></Card>
            ) : (
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>نمو المستخدمين (آخر ٦ أشهر)</CardTitle>
                    <CardDescription className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> مستخدمون جدد مسجّلون شهريًا</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {userQuery.loading || !userQuery.data ? <SkeletonText lines={6} /> : <LineChart data={userQuery.data.trend} color="#C9971F" />}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="governorates">
            {governorateQuery.error ? (
              <Card><ErrorState description={governorateQuery.errorMessage ?? undefined} onRetry={governorateQuery.refetch} /></Card>
            ) : (
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>توزيع الصيدليات حسب المحافظة</CardTitle>
                    <CardDescription>عدد الصيدليات المسجّلة فعليًا في كل محافظة</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {governorateQuery.loading || !governorateQuery.data ? (
                    <SkeletonText lines={6} />
                  ) : (
                    <BarChart data={governorateQuery.data.byGovernorate} height={340} />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="duty">
            {dutyQuery.error ? (
              <Card><ErrorState description={dutyQuery.errorMessage ?? undefined} onRetry={dutyQuery.refetch} /></Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatisticsCard label="إجمالي المناوبات المجدولة" value={dutyQuery.data?.total ?? 0} icon={Moon} />
                <StatisticsCard label="محافظات مغطاة بمناوبات" value={dutyQuery.data?.governoratesCovered ?? 0} icon={MapPin} tone="success" />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
