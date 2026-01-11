import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface BarChartProps {
  data: { label: string; value: number }[];
  xLabel?: string;
  yLabel?: string;
  yDomain?: [number, number];
  tooltipFormatter?: (value: number) => string;
}

export default function BarChart({
  data,
  xLabel,
  yLabel,
  yDomain,
  tooltipFormatter,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReBarChart
        data={data}
        margin={{ top: 16, right: 24, left: 16, bottom: 32 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          label={
            xLabel
              ? { value: xLabel, position: "insideBottom", offset: -10 }
              : undefined
          }
        />

        <YAxis
          domain={yDomain}
          tickLine={false}
          axisLine={false}
          label={
            yLabel
              ? {
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                }
              : undefined
          }
        />

        <Tooltip
          formatter={
            tooltipFormatter
              ? (v) => tooltipFormatter(Number(v))
              : undefined
          }
        />

        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
          fill="#3b82f6"
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
