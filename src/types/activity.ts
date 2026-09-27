/**
 * The full action slug from the backend (e.g. "pharmacy.approve",
 * "advertisement.create") — kept as a plain string rather than a fixed
 * union, since ActivityLogger on the backend can record any
 * "domain.verb" action and a closed union would silently mis-tag new
 * ones. UI color-coding (see activity-log/page.tsx) keys off substrings
 * like "approve"/"reject"/"delete" instead of requiring an exact match.
 */
export interface ActivityLogEntry {
  id: string;
  adminName: string;
  adminAvatarUrl: string | null;
  action: string;
  actionLabel: string;
  targetType: string;
  targetLabel: string;
  details: string;
  createdAt: string;
}
