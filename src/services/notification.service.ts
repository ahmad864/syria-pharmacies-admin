import { apiClient } from "@/lib/api-client";
import type { AdminNotification } from "@/types/notification";

interface RawNotification {
  id: string; title: string; body: string; image_url: string | null;
  recipients_count: number; sent_by: string | null; sent_at: string;
}
interface RawListResponse {
  items: RawNotification[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

function mapNotification(raw: RawNotification): AdminNotification {
  return {
    id: raw.id,
    title: raw.title,
    body: raw.body,
    // Scoped down per the brief: broadcast-to-all-users only, no audience
    // targeting — this is always "all users", reflected directly rather
    // than through an invented audience/recipientLabel abstraction.
    audience: "all",
    recipientLabel: `جميع المستخدمين (${raw.recipients_count})`,
    status: "sent",
    sentAt: raw.sent_at,
    createdAt: raw.sent_at,
  };
}

/** GET /api/v1/admin/notifications */
export async function listNotifications(): Promise<AdminNotification[]> {
  const raw = await apiClient.get<RawListResponse>("/admin/notifications", { per_page: 50 });
  return raw.items.map(mapNotification);
}

export interface SendNotificationInput {
  title: string;
  body: string;
  image?: File;
}

/**
 * POST /api/v1/admin/notifications (multipart). Honest status: this
 * durably records the send and returns the real recipient count Laravel
 * computed, but actual push delivery is not wired to a real provider yet
 * — see the backend's App\Services\PushNotificationService doc comment.
 */
export async function sendNotification(input: SendNotificationInput): Promise<AdminNotification> {
  const form = new FormData();
  form.append("title", input.title);
  form.append("body", input.body);
  if (input.image) form.append("image", input.image);

  const raw = await apiClient.postForm<RawNotification>("/admin/notifications", form);
  return mapNotification(raw);
}
