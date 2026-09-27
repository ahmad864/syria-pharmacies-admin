export interface StatCard {
  id: string;
  label: string;
  value: number;
  /** Only present when a real historical comparison exists — never fabricated. */
  delta?: number;
  trend?: "up" | "down" | "flat";
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface GovernorateBreakdown {
  governorate: string;
  count: number;
}

export interface ActivityOverviewPoint {
  label: string;
  pharmacies: number;
  users: number;
}
