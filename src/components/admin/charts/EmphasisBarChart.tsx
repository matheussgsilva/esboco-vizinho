"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type EmphasisPoint = { label: string; value: number };

function EmphasisTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: EmphasisPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-md">
      <p className="text-ink-muted">{point.label}</p>
      <p className="font-semibold text-ink">{point.value}</p>
    </div>
  );
}

export function EmphasisBarChart({ data }: { data: EmphasisPoint[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
        />
        <Tooltip content={<EmphasisTooltip />} cursor={{ fill: "var(--color-border)", opacity: 0.3 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((entry) => {
            const isMax = entry.value === maxValue && maxValue > 0;
            return (
              <Cell key={entry.label} fill={isMax ? "#EA5455" : "var(--color-border)"} />
            );
          })}
          <LabelList
            dataKey="value"
            position="top"
            content={({ x, y, width, value }) => {
              if (value !== maxValue || maxValue === 0) return null;
              const cx = Number(x) + Number(width) / 2;
              return (
                <text x={cx} y={Number(y) - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-ink)">
                  {value}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
