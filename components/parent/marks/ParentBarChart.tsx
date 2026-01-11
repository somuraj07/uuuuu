"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartData {
  label: string;
  value: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload || !payload.length) return null;

  const subject = payload[0].payload.label;
  const value = payload[0].payload.value;

  return (
    <div
      className="bg-white rounded-xl px-4 py-3 shadow-xl text-center min-w-[140px]"
      style={{
        transform: "translate(-50%, -12px)", 
      }}
    >
      <p
        className="text-sm font-medium text-gray-600 truncate"
        title={subject}
      >
        {subject}
      </p>

      <p className="text-sm mt-1">
        <span className="text-gray-500">value :</span>{" "}
        <span className="font-semibold text-green-600">
          {value}
        </span>
      </p>
    </div>
  );
}

export default function ParentBarChart({
  data,
  yDomain,
}: {
  data: ChartData[];
  yDomain?: [number, number];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />

        <YAxis
          domain={yDomain}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />

        <Tooltip
          shared={false}
          cursor={{ fill: "#e5e7eb" }}
          position={{ y: 0 }}          
          content={<CustomTooltip />}
        />

        <Bar
          dataKey="value"
          fill="#22c55e"
          radius={[10, 10, 0, 0]}
          barSize={42}
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
