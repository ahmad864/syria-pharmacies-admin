"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/states/Skeleton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { listPharmacies } from "@/services/pharmacy.service";
import { GOVERNORATES } from "@/types/pharmacy";

// Leaflet touches `window` at import time, so it must never be part of the
// server bundle — load it purely on the client.
const PharmacyMap = dynamic(() => import("@/features/map/PharmacyMap").then((m) => m.PharmacyMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function MapPage() {
  const [governorate, setGovernorate] = useState("");
  // Capped at 100 markers per load rather than the whole table (brief
  // section 12: "لا تحمل عددًا ضخمًا من الصيدليات دفعة واحدة") — a real
  // bounding-box/clustering strategy is the natural next step once the
  // dataset regularly exceeds this per governorate; noted in the final report.
  const { data, loading } = useApiQuery(
    () => listPharmacies({ governorate: governorate || undefined, status: "approved", perPage: 100 }),
    [governorate]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader
        title="الخريطة"
        description="عرض الصيدليات المفعّلة على الخريطة (بيانات حقيقية من الخادم)"
        actions={
          <div className="w-44">
            <Select value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </div>
        }
      />
      <div className="min-h-[400px] flex-1 overflow-hidden rounded-2xl border border-surface-border shadow-card">
        {loading ? <Skeleton className="h-full w-full" /> : <PharmacyMap pharmacies={data?.items ?? []} />}
      </div>
      {!governorate && (data?.pagination.total ?? 0) > 100 && (
        <p className="mt-3 text-center text-[11px] text-ink-faint">
          يعرض أول ١٠٠ صيدلية فقط من إجمالي {data?.pagination.total} — اختر محافظة لعرض أدق.
        </p>
      )}
    </div>
  );
}
