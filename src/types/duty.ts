import type { Governorate } from "./pharmacy";

/**
 * Matches the real backend model: a duty is a *recurring weekly* slot
 * (day_of_week 1..7, Monday..Sunday) — never tied to a specific calendar
 * date. See PharmacyDutyResource.php / the Flutter DutySchedule model,
 * which both work this way. There is no `date` field anywhere in this
 * system for duties.
 */
export interface DutyEntry {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  governorate: Governorate;
  region: string;
  dayOfWeek: number; // 1 (Monday) .. 7 (Sunday)
  dayName: string;
  from: string; // "HH:mm"
  to: string; // "HH:mm"
  status: "scheduled" | "cancelled";
}
