"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

export function ApprovalGauge({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const color = clamped >= 70 ? "#27AE60" : "#EA5455";
  const data = [{ value: clamped }];

  return (
    <div className="relative flex items-center justify-center">
      <RadialBarChart
        width={180}
        height={140}
        cx="50%"
        cy="70%"
        innerRadius="120%"
        outerRadius="170%"
        startAngle={180}
        endAngle={0}
        data={data}
        barSize={14}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          dataKey="value"
          background={{ fill: "var(--color-border)" }}
          cornerRadius={7}
          fill={color}
          isAnimationActive={false}
        />
      </RadialBarChart>
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
        <span className="text-2xl font-semibold text-ink">{clamped}%</span>
      </div>
    </div>
  );
}
