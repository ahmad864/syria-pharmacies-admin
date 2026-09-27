import type { DutyEntry } from "@/types/duty";
import { MOCK_PHARMACIES, extraFutureDuties } from "./pharmacies";

const DAY_NAMES = [
  "",
  "ط§ظ„ط§ط«ظ†ظٹظ†",
  "ط§ظ„ط«ظ„ط§ط«ط§ط،",
  "ط§ظ„ط£ط±ط¨ط¹ط§ط،",
  "ط§ظ„ط®ظ…ظٹط³",
  "ط§ظ„ط¬ظ…ط¹ط©",
  "ط§ظ„ط³ط¨طھ",
  "ط§ظ„ط£ط­ط¯",
];

function toDayOfWeek(date: string): number {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day === 0 ? 7 : day;
}

function toDuty(pharmacy: (typeof MOCK_PHARMACIES)[number], d: {
  id: string;
  date: string;
  from: string;
  to: string;
  pharmacyId?: string;
}): DutyEntry {
  const dayOfWeek = toDayOfWeek(d.date);

  return {
    id: d.id,
    pharmacyId: d.pharmacyId ?? pharmacy.id,
    pharmacyName: pharmacy.name,
    governorate: pharmacy.governorate,
    region: pharmacy.region,
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek] ?? "",
    from: d.from,
    to: d.to,
    status: "scheduled",
  };
}

export const MOCK_DUTIES: DutyEntry[] = [
  ...MOCK_PHARMACIES.flatMap((p) =>
    p.dutySchedules.map((d) => toDuty(p, d))
  ),
  ...extraFutureDuties().map((d) => {
    const pharmacy = MOCK_PHARMACIES.find(
      (p) => p.id === d.pharmacyId
    );

    if (!pharmacy) {
      throw new Error(`Mock pharmacy not found: ${d.pharmacyId}`);
    }

    return toDuty(pharmacy, d);
  }),
];