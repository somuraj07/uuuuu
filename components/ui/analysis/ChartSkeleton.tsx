"use client";

export default function ChartSkeleton() {
  return (
    <div className="h-[320px] w-full rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}
