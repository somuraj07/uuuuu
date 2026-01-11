"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/attendance/Header";
import Stats from "@/components/ui/attendance/Stats";
import DateSelector from "@/components/ui/attendance/DateSelector";
import Schedule from "@/components/ui/attendance/Schedule";

type Attendance = {
  date: string;
  period: number;
  subject: string;
  status: "PRESENT" | "ABSENT" | "LATE";
};

export default function AttendancePage({
  attendanceStats,
}: {
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    percent: number;
  };
}) {
  const [data, setData] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/attendance/view?date=${selectedDate}`, {
      cache: "no-store",
    })
      .then(res => res.json())
      .then(res => setData(res.attendances || []))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  /* ----------------- STATS ----------------- */
  const stats = useMemo(
    () => ({
      presentPercent: attendanceStats.percent,
      absent: attendanceStats.absent,
      late: attendanceStats.late,
    }),
    [attendanceStats]
  );

  return (
    <div
      className="
        w-full
        px-3 sm:px-4 md:px-6
        py-4 md:py-6
        overflow-x-hidden
      "
    >
      {/* Centered container for large screens */}
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
        {/* Header */}
        <Header />

        {/* Stats */}
        <Stats stats={stats} />

        {/* Date selector */}
        <DateSelector
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        {/* Schedule */}
        <Schedule data={data} loading={loading} />
      </div>
    </div>
  );
}
