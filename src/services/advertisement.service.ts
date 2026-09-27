import { apiClient } from "@/lib/api-client";
import type { Advertisement, AdvertisementStatus } from "@/types/advertisement";

interface RawAd {
  id: string; title: string; image_url: string | null; link_url: string | null;
  status: AdvertisementStatus; start_date: string; end_date: string;
  sort_order: number; views: number; clicks: number; created_at: string;
}

function mapAd(raw: RawAd): Advertisement {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: raw.image_url ?? "",
    linkUrl: raw.link_url,
    status: raw.status,
    startDate: raw.start_date,
    endDate: raw.end_date,
    views: raw.views,
    clicks: raw.clicks,
    createdAt: raw.created_at,
  };
}

/** GET /api/v1/admin/advertisements */
export async function listAdvertisements(): Promise<Advertisement[]> {
  const raw = await apiClient.get<RawAd[]>("/admin/advertisements");
  return raw.map(mapAd);
}

export interface CreateAdvertisementInput {
  title: string;
  image: File;
  linkUrl?: string;
  startDate: string;
  endDate: string;
}

/** POST /api/v1/admin/advertisements (multipart) */
export async function createAdvertisement(input: CreateAdvertisementInput): Promise<Advertisement> {
  const form = new FormData();
  form.append("title", input.title);
  form.append("image", input.image);
  if (input.linkUrl) form.append("link_url", input.linkUrl);
  form.append("start_date", input.startDate);
  form.append("end_date", input.endDate);

  const raw = await apiClient.postForm<RawAd>("/admin/advertisements", form);
  return mapAd(raw);
}

/** PUT /api/v1/admin/advertisements/{id} — toggling active/disabled reuses this with only `is_disabled`. */
export async function updateAdvertisement(id: string, patch: { isDisabled?: boolean; title?: string; linkUrl?: string; startDate?: string; endDate?: string; image?: File }): Promise<Advertisement> {
  const form = new FormData();
  if (patch.title !== undefined) form.append("title", patch.title);
  if (patch.linkUrl !== undefined) form.append("link_url", patch.linkUrl);
  if (patch.startDate !== undefined) form.append("start_date", patch.startDate);
  if (patch.endDate !== undefined) form.append("end_date", patch.endDate);
  if (patch.isDisabled !== undefined) form.append("is_disabled", patch.isDisabled ? "1" : "0");
  if (patch.image) form.append("image", patch.image);

  const raw = await apiClient.putForm<RawAd>(`/admin/advertisements/${id}`, form);
  return mapAd(raw);
}

export async function toggleAdvertisement(id: string, nextStatus: "active" | "disabled"): Promise<Advertisement> {
  return updateAdvertisement(id, { isDisabled: nextStatus === "disabled" });
}

/** DELETE /api/v1/admin/advertisements/{id} */
export async function deleteAdvertisement(id: string): Promise<void> {
  await apiClient.delete(`/admin/advertisements/${id}`);
}
