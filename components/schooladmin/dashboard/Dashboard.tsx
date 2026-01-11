"use client";
import SchoolAdminAttendanceCard from "@/components/ui/SchoolAdminAttendanceCard";
import SchoolAdminNewsFeedCard from "@/components/ui/SchoolAdminNewsFeedCard";
import SchoolAdminWorkshopCard from "@/components/ui/SchoolAdminWorkshopCard";
import SchoolAdminStatCard from "@/components/ui/SchoolAdminStatCard";
import {
  BookOpen,
  Users,
  GraduationCap,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

interface DashboardTabProps {
  loading: boolean;
  stats: any;
  attendance: any;
  workshops: any;
  news: any;
  reload: any;
  error: any;
}

export default function DashboardTab({
  loading,
  stats,
  attendance,
  workshops,
  news,
  error,
  reload,
}: DashboardTabProps) {
  if (loading) {
    return <p className="text-gray-400 text-center">Loading dashboard...</p>;
  }

  {
    error && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4">
        <p className="font-medium">{error.message}</p>
        <p className="text-sm">Failed: {error.failedApis.join(", ")}</p>
        <button onClick={reload} className="mt-2 text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back! Here's an overview of your school
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SchoolAdminStatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={<BookOpen size={30} className="text-black" />}
          bg="bg-gradient-to-br from-white via-white to-blue-100"
          iconBg="bg-blue-50"
          index={0}
        />

        <SchoolAdminStatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={30} className="text-black" />}
          bg="bg-gradient-to-br from-white via-white to-green-100"
          iconBg="bg-green-50"
          index={1}
        />

        <SchoolAdminStatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={<GraduationCap size={30} className="text-black" />}
          bg="bg-gradient-to-br from-white via-white to-purple-100"
          iconBg="bg-purple-50"
          index={2}
        />

        <SchoolAdminStatCard
          title="Upcoming Workshops"
          value={stats.upcomingWorkshops}
          icon={<CalendarDays size={30} className="text-black" />}
          bg="bg-gradient-to-br from-white via-white to-orange-100"
          iconBg="bg-orange-50"
          index={3}
        />

        <SchoolAdminStatCard
          title="Fees Collected"
          value={`₹${(stats.feesCollected / 100000).toFixed(1)}L`}
          icon={<IndianRupee size={30} className="text-black" />}
          bg="bg-gradient-to-br from-white via-white to-emerald-100"
          iconBg="bg-emerald-50"
          index={4}
        />
      </div>

      {/* Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SchoolAdminAttendanceCard
          title="Student Attendance"
          percent={attendance.student.percent}
          meta={`Present: ${attendance.student.present} | Absent: ${attendance.student.absent}`}
        />

        <SchoolAdminAttendanceCard
          title="Teacher Leave"
          percent={attendance.teacher.percent}
          meta={`On Leave: ${attendance.teacher.onLeave} | Present: ${attendance.teacher.present}`}
        />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SchoolAdminWorkshopCard workshops={workshops} />
        <SchoolAdminNewsFeedCard news={news} />
      </div>
    </div>
  );
}
