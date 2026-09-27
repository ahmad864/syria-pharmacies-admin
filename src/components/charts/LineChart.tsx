"use client";

import {
  ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as RTooltip,
} from "recharts";
import type { TimeSeriesPoint } from "@/types/dashboard";

export function LineChart({ data, color = "#0E7C66", height = 260 }: { data: TimeSeriesPoint[]; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--surface-border))" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgb(var(--ink-faint))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "rgb(var(--ink-faint))" }} axisLine={false} tickLine={false} />
        <RTooltip
          contentStyle={{
            direction: "rtl",
            borderRadius: 12,
            border: "1px solid rgb(var(--surface-border))",
            background: "rgb(var(--surface-raised))",
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
