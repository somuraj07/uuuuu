"use client";

import { ResponsiveContainer, LineChart as LC, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function LineChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LC data={data}>
        <XAxis dataKey="label" />
        <YAxis
  label={{
    value: "Number of Students",
    angle: -90,
    position: "insideLeft",
  }}
/>

        <Tooltip />
        <Line dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
      </LC>
    </ResponsiveContainer>
  );
}
