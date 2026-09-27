import type { Pharmacist } from "@/types/pharmacist";
import { seededRandom, isoDaysAgo } from "./seed";
import { MOCK_PHARMACIES } from "./pharmacies";

export const MOCK_PHARMACISTS: Pharmacist[] = MOCK_PHARMACIES.filter((p) => p.status !== "pending").map((p, i) => {
  const rand = seededRandom(5000 + i);
  return {
    id: `pharmacist-${i}`,
    name: p.ownerName ?? p.name,
    phone: p.phone,
    phoneVerified: rand() > 0.15,
    pharmacyId: p.id,
    pharmacyName: p.name,
    governorate: p.governorate,
    status: p.status === "disabled" ? "disabled" : "active",
    createdAt: isoDaysAgo(Math.floor(rand() * 400)),
  };
});
