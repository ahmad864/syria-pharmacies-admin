import type { AppUser } from "@/types/user";
import { seededRandom, isoDaysAgo } from "./seed";

const FIRST = ["أحمد", "محمد", "علي", "حسين", "ليلى", "سارة", "رهف", "جود", "كريم", "ياسر", "دانا", "لينا", "زياد", "مايا"];
const LAST = ["الأحمد", "الحسن", "العلي", "المصري", "الخوري", "الشيخ", "دبس", "زيدان", "قدور", "شعبان"];

export const MOCK_USERS: AppUser[] = Array.from({ length: 84 }, (_, i) => {
  const rand = seededRandom(7000 + i);
  return {
    id: `user-${i}`,
    name: `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`,
    phone: `09${Math.floor(10000000 + rand() * 89999999)}`,
    role: "user" as const,
    status: rand() > 0.92 ? ("disabled" as const) : ("active" as const),
    phoneVerified: rand() > 0.1,
    favoritesCount: Math.floor(rand() * 12),
    createdAt: isoDaysAgo(Math.floor(rand() * 500)),
  };
});
