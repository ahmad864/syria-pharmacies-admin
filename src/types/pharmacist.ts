import type { Governorate } from "./pharmacy";

export type AccountStatus = "active" | "disabled";

/** The account that owns a pharmacy (role=pharmacy on the backend). */
export interface Pharmacist {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  pharmacyId: string;
  pharmacyName: string;
  governorate: Governorate;
  status: AccountStatus;
  createdAt: string;
}
