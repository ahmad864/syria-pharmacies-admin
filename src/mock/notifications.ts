import type { AdminNotification } from "@/types/notification";
import { isoDaysAgo } from "./seed";

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-1", title: "تحديث ساعات العمل خلال العطلة", body: "يرجى تحديث ساعات الدوام لصيدليتكم خلال أيام العطلة الرسمية.",
    audience: "pharmacists", recipientLabel: "جميع الصيادلة", status: "sent", sentAt: isoDaysAgo(2), createdAt: isoDaysAgo(2),
  },
  {
    id: "notif-2", title: "صيانة مجدولة للتطبيق", body: "سيتم إجراء صيانة على التطبيق يوم الجمعة من الساعة ٢ إلى ٤ صباحًا.",
    audience: "all", recipientLabel: "جميع المستخدمين", status: "sent", sentAt: isoDaysAgo(5), createdAt: isoDaysAgo(5),
  },
  {
    id: "notif-3", title: "تذكير بتفعيل حسابك", body: "لم يتم تفعيل رقم هاتفك بعد، يرجى إكمال عملية التحقق.",
    audience: "users", recipientLabel: "المستخدمون غير الموثقين", status: "scheduled", sentAt: null, createdAt: isoDaysAgo(1),
  },
  {
    id: "notif-4", title: "مرحبًا بصيدلية الشفاء", body: "تم قبول طلب تسجيل صيدليتكم بنجاح، أهلًا بكم في المنصة.",
    audience: "single", recipientLabel: "صيدلية الشفاء", status: "draft", sentAt: null, createdAt: isoDaysAgo(0),
  },
];
