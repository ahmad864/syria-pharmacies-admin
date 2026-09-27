export type AdvertisementStatus = "active" | "scheduled" | "expired" | "disabled";

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  status: AdvertisementStatus;
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
  createdAt: string;
}
