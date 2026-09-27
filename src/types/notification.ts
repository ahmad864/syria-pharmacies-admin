export type NotificationAudience = "all" | "users" | "pharmacists" | "single";
export type NotificationStatus = "draft" | "sent" | "scheduled";

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  audience: NotificationAudience;
  recipientLabel: string;
  status: NotificationStatus;
  sentAt: string | null;
  createdAt: string;
}
