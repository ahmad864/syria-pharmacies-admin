import type { Advertisement } from "@/types/advertisement";
import { seededRandom, isoDaysAgo, isoDaysFromNow } from "./seed";

const TITLES = [
  "ط¹ط±ط¶ ط®ط§طµ ط¹ظ„ظ‰ ط§ظ„ظپظٹطھط§ظ…ظٹظ†ط§طھ", "ط­ظ…ظ„ط© ط§ظ„طھظˆط¹ظٹط© ط§ظ„طµط­ظٹط© ط§ظ„ط´طھظˆظٹط©", "ط®طµظ… ط¹ظ„ظ‰ ط£ط¯ظˆظٹط© ط§ظ„ط£ط·ظپط§ظ„",
  "ط§ظپطھطھط§ط­ طµظٹط¯ظ„ظٹط§طھ ط¬ط¯ظٹط¯ط©", "ظ†طµط§ط¦ط­ ظ„ظ„ظˆظ‚ط§ظٹط© ظ…ظ† ط§ظ„ط¥ظ†ظپظ„ظˆظ†ط²ط§", "ط¹ط±ط¶ ط¨ط·ط§ظ‚ط© ط§ظ„ظˆظ„ط§ط،",
];

export const MOCK_ADVERTISEMENTS: Advertisement[] = TITLES.map((title, i) => {
  const rand = seededRandom(9000 + i);
  const status = (["active", "scheduled", "expired", "disabled"] as const)[i % 4]!;
  return {
    id: `ad-${i}`,
    title,
    imageUrl: `https://picsum.photos/seed/ad-${i}/480/240`,
    linkUrl: null,
    status,
    startDate: isoDaysAgo(10 - i).slice(0, 10),
    endDate: isoDaysFromNow(20 + i).slice(0, 10),
    views: Math.floor(rand() * 5000),
    clicks: Math.floor(rand() * 400),
    createdAt: isoDaysAgo(30 - i),
  };
});
