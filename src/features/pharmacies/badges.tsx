import { Badge } from "@/components/ui/Badge";
import { PHARMACY_STATUS_LABEL, OPENING_STATUS_LABEL } from "@/constants/status";
import type { PharmacyStatus, OpeningStatusKey } from "@/types/pharmacy";

export function PharmacyStatusBadge({ status }: { status: PharmacyStatus }) {
  const tone = status === "approved" ? "success" : status === "pending" ? "amber" : status === "rejected" ? "danger" : "neutral";
  return <Badge tone={tone} dot>{PHARMACY_STATUS_LABEL[status]}</Badge>;
}

export function OpeningStatusBadge({ status }: { status: OpeningStatusKey }) {
  const tone = status === "open" ? "success" : status === "onduty" ? "info" : status === "temp" ? "amber" : "neutral";
  return <Badge tone={tone} dot>{OPENING_STATUS_LABEL[status]}</Badge>;
}
