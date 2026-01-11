// components/parent/marks/CustomTooltip.tsx
"use client";

export default function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0]?.payload?.value; 

  return (
    <div className="bg-white border rounded-lg px-3 py-2 shadow">
      <p className="text-sm font-semibold text-gray-800">
        {label}
      </p>
      <p className="text-sm text-gray-600">
        Marks: <strong>{value}%</strong>
      </p>
    </div>
  );
}
