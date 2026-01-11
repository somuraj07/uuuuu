"use client";

import { useEffect, useState } from "react";
import Filters from "@/components/ui/analysis/Filters";
import EmptyState from "@/components/ui/analysis/EmptyState";
import ChartSkeleton from "@/components/ui/analysis/ChartSkeleton";
import ChartError from "@/components/ui/analysis/ChartError";
import LineChart from "@/components/ui/charts/LineChart";
import BarChart from "@/components/ui/charts/BarChart";
import { BarChart3 } from "lucide-react";

export default function AnalysisClient() {
  const [filters, setFilters] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!filters.parameter || !filters.period) return;

    setLoading(true);
    setError(false);

    fetch(`/api/analysis?${new URLSearchParams(filters)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [filters]);

  const showEmpty =
    !filters.parameter || !filters.period || (!loading && data.length === 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
          <BarChart3 size={20} />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analysis</h1>
          <p className="text-sm text-gray-500">
            Analyze school performance metrics and trends
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Select Parameters</h3>
        <Filters filters={filters} onChange={setFilters} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[350px]">
        {loading && <ChartSkeleton />}
        {error && <ChartError />}

        {!loading && showEmpty && (
          <EmptyState
            text={
              !filters.parameter
                ? "Please select a parameter to view analysis"
                : !filters.period
                ? "Please select a time period"
                : "No data available for selected filters"
            }
          />
        )}

        {!loading && data.length > 0 && (
          <>
            <div className="mb-4">
              <h4 className="font-semibold text-lg">
                {filters.parameter === "fees" && "Fees Collected"}
                {filters.parameter === "attendance" && "Attendance by Class"}
                {filters.parameter === "enrollment" && "Student Enrollment"}
              </h4>
              <p className="text-sm text-gray-500">
                {filters.period === "yearly"
                  ? `Year ${filters.year}`
                  : `Month ${filters.month}, ${filters.year}`}
              </p>
            </div>

            {filters.parameter === "enrollment" ? (
              <LineChart data={data} xLabel="Month" yLabel="Total Students" />
            ) : (
              <BarChart
                data={data}
                xLabel="Class"
                yLabel="Attendance (%)"
                yDomain={[0, 100]}
                tooltipFormatter={(v) => `${v}%`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
