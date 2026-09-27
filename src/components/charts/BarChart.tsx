"use client";

import {
  ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RTooltip,
} from "recharts";
import type { GovernorateBreakdown } from "@/types/dashboard";

export function BarChart({ data, color = "#0E7C66", height = 300 }: { data: GovernorateBreakdown[]; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgb(var(--surface-border))" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "rgb(var(--ink-faint))" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="governorate"
          width={72}
          tick={{ fontSize: 12, fill: "rgb(var(--ink-muted))" }}
          axisLine={false}
          tickLine={false}
        />
        <RTooltip
          cursor={{ fill: "rgb(var(--surface-muted))" }}
          contentStyle={{
            direction: "rtl",
            borderRadius: 12,
            border: "1px solid rgb(var(--surface-border))",
            background: "rgb(var(--surface-raised))",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill={color} radius={[0, 6, 6, 0]} barSize={14} />
      </RBarChart>
    </ResponsiveContainer>
  );
}
