"use client";

import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Tooltip as RTooltip, Legend } from "recharts";

export interface PieDatum {
  label: string;
  value: number;
}

const COLORS = ["#0E7C66", "#C9971F", "#4B9F89", "#D93A32", "#78BBA8"];

export function PieChart({ data, height = 260 }: { data: PieDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={58} outerRadius={88} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length] ?? "#0E7C66"} stroke="rgb(var(--surface-raised))" strokeWidth={2} />
          ))}
        </Pie>
        <RTooltip
          contentStyle={{
            direction: "rtl",
            borderRadius: 12,
            border: "1px solid rgb(var(--surface-border))",
            background: "rgb(var(--surface-raised))",
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(value) => <span className="text-xs text-ink-muted">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </RPieChart>
    </ResponsiveContainer>
  );
}
