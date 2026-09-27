export const GOVERNORATES = [
  "ط¯ظ…ط´ظ‚", "ط±ظٹظپ ط¯ظ…ط´ظ‚", "ط­ظ„ط¨", "ط­ظ…طµ", "ط­ظ…ط§ط©", "ط§ظ„ظ„ط§ط°ظ‚ظٹط©", "ط·ط±ط·ظˆط³",
  "ط¥ط¯ظ„ط¨", "ط¯ط±ط¹ط§", "ط§ظ„ط³ظˆظٹط¯ط§ط،", "ط§ظ„ظ‚ظ†ظٹط·ط±ط©", "ط¯ظٹط± ط§ظ„ط²ظˆط±", "ط§ظ„ط±ظ‚ط©", "ط§ظ„ط­ط³ظƒط©",
] as const;

export type Governorate = (typeof GOVERNORATES)[number];

export type PharmacyStatus = "pending" | "approved" | "rejected" | "disabled";

export type OpeningStatusKey = "open" | "closed" | "temp" | "onduty";

export interface OpeningStatus {
  key: OpeningStatusKey;
  label: string;
  detail: string;
}

export interface DayHours {
  dayOfWeek: number; // 1 (Monday) .. 7 (Sunday) â€” matches Laravel's day_of_week
  open: string | null; // "HH:mm"
  close: string | null; // "HH:mm"
  enabled: boolean;
}

export interface TemporaryClosure {
  from: string; // "HH:mm"
  to: string; // "HH:mm"
}

export interface DutySchedule {
  id: string;
  pharmacyId?: string;
  date: string; // ISO date
  from: string; // "HH:mm"
  to: string; // "HH:mm"
}

export interface Pharmacy {
  id: string;
  name: string;
  description: string | null;
  ownerName: string | null;
  phone: string;
  secondaryPhone: string | null;
  governorate: Governorate;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  logoUrl: string | null;
  verified: boolean;
  status: PharmacyStatus;
  rejectionReason: string | null;
  openingStatus: OpeningStatus;
  isOnDutyToday: boolean;
  workingHours: DayHours[];
  temporaryClosure: TemporaryClosure | null;
  dutySchedules: DutySchedule[];
  createdAt: string;
  approvedAt: string | null;
}

/** A pharmacy whose `status` is `pending` â€” same entity, dedicated view for the applications queue. */
export type PharmacyApplication = Pharmacy;

/**
 * Maps the real `PharmacyResource` JSON from Laravel (snake_case) into the
 * dashboard's camelCase `Pharmacy` type. This is the ONLY place that
 * conversion happens â€” see API_DOCUMENTATION.md in the backend repo for
 * the authoritative field list this must stay in sync with.
 */
export function mapPharmacy(json: Record<string, unknown>): Pharmacy {
  const workingHours = ((json.working_hours as Record<string, unknown>[]) ?? []).map((h) => ({
    dayOfWeek: h.day_of_week as number,
    open: (h.open as string | null) ?? null,
    close: (h.close as string | null) ?? null,
    enabled: h.enabled as boolean,
  }));

  const dutySchedules = ((json.on_duty_schedules as Record<string, unknown>[]) ?? []).map((d) => ({
    id: String(d.id),
    date: d.date as string,
    from: d.from as string,
    to: d.to as string,
  }));

  const tempClosure = json.temporary_closure as { from: string; to: string } | null;
  const openingStatus = json.opening_status as OpeningStatus;

  return {
    id: String(json.id),
    name: json.name as string,
    description: (json.description as string | null) ?? null,
    ownerName: (json.owner_name as string | null) ?? null,
    phone: json.phone as string,
    secondaryPhone: (json.secondary_phone as string | null) ?? null,
    governorate: json.governorate as Governorate,
    region: (json.region as string) ?? "",
    address: json.address as string,
    latitude: Number(json.latitude),
    longitude: Number(json.longitude),
    logoUrl: (json.logo_url as string | null) ?? null,
    verified: Boolean(json.verified),
    status: json.status as PharmacyStatus,
    rejectionReason: (json.rejection_reason as string | null) ?? null,
    openingStatus: openingStatus ?? { key: "closed", label: "", detail: "" },
    isOnDutyToday: Boolean(json.is_on_duty),
    workingHours,
    temporaryClosure: tempClosure ? { from: tempClosure.from, to: tempClosure.to } : null,
    dutySchedules,
    createdAt: json.created_at as string,
    approvedAt: (json.approved_at as string | null) ?? null,
  };
}
