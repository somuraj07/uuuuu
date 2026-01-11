"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";

import SchoolAdminSideBar from "@/components/layout/SchoolAdminSideBar";
import { SCHOOLADMIN_MENU_ITEMS } from "@/constants/schooladmin/sidebar";
import DashboardTab from "@/components/schooladmin/dashboard/Dashboard";
import { useDashboardData } from "@/hooks/useSchoolAdminDashboard";
import TeachersPage from "@/components/schooladmin/teachers/Teachers";

import StudentsManagementPage from "@/components/schooladmin/studentsManagement/StudentManagement";
import TeacherLeavesPage from "@/components/schooladmin/teachersleaves/TeacherLeaves";
import FeePaymentsPage from "@/components/schooladmin/schoolpayments/SchoolPayements";
import SchoolAdminClassesPage from "@/components/schooladmin/classes/Classes";
import WorkshopsPage from "@/components/schooladmin/workshops/WorkShops";
import AnalysisClient from "@/components/schooladmin/analysis/Analysis";
import NewsfeedPage from "@/components/schooladmin/newsfeed/Newsfeed";
import TimetablePage from "@/components/schooladmin/timetable/Timetable";
import ExamsPage from "@/components/schooladmin/exams/Exams";
import AdminTeacherAttendancePage from "@/components/schooladmin/teacherAttendance/TeacherAttendance";
import StudentLookupPage from "@/components/schooladmin/studentLookup/StudentLookup";

export default function SchoolAdminLayout() {
  const [open, setOpen] = useState(false);
  const tab = useSearchParams().get("tab") ?? "dashboard";
  const {
    loading,
    stats,
    attendance,
    students,
    teacherLeaves,
    teacherPendingLeaves,
    classes,
    error,
    events,
    news,
    teachers,
    tcRequestsAll,
    tcRequestsPending,
    feeDetails,
    feeStats,
    reloadDashboard,
    reloadClasses,
    reloadStudents,
    reloadTeachers,
    reloadLeaves,
    reloadTCRequests,
  } = useDashboardData();

  const renderPage = () => {
    switch (tab) {
      case "students":
        return (
          <StudentsManagementPage classes={classes} reload={reloadStudents} />
        );
      case "classes":
        return (
          <SchoolAdminClassesPage
            teachers={teachers}
            loadingTeachers={loading}
            reload={reloadClasses}
          />
        );
      case "teachers":
        return (
          <TeachersPage
            teachers={teachers}
            reload={reloadTeachers}
            loading={loading}
          />
        );
      case "teacher-leaves":
        return (
          <TeacherLeavesPage
            allLeaves={teacherLeaves}
            pending={teacherPendingLeaves}
            loading={loading}
            reload={reloadLeaves}
          />
        );
      case "tc-approvals":
        return (
          <TeacherLeavesPage
            allLeaves={tcRequestsAll}
            pending={tcRequestsPending}
            loading={loading}
            reload={reloadTCRequests}
            isTCApprovalsPage={true}
          />
        );
      case "payments":
        return (
          <FeePaymentsPage
            classes={classes}
            fees={feeDetails}
            stats={feeStats}
          />
        );
      case "workshops":
        return <WorkshopsPage workshops={events} loading={loading} reload={reloadDashboard} />;
      case "newsfeed":
        return <NewsfeedPage />;
      case "timetable":
        return (
          <TimetablePage
            classes={classes}
            teachers={teachers}
            reload={reloadClasses}
          />
        );
      case "exams":
        return <ExamsPage />;
      case "teacher-attendance":
        return <AdminTeacherAttendancePage />;
      case "student-lookup":
        return <StudentLookupPage />;
      case "analysis":
        return <AnalysisClient />;
      default:
        return (
          <DashboardTab
            loading={loading}
            stats={stats}
            attendance={attendance}
            workshops={events}
            news={news}
            reload={reloadDashboard}
            error={error}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 animate-dashboard-container bg-[#f8fafc]">
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className="hidden md:block">
        <SchoolAdminSideBar menuItems={SCHOOLADMIN_MENU_ITEMS} />
      </aside>

      {/* ========== MOBILE SIDEBAR DRAWER ========== */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow-lg">
            <SchoolAdminSideBar
              menuItems={SCHOOLADMIN_MENU_ITEMS}
              onClose={() => setOpen(false)}
            />
          </div>

          {/* Overlay */}
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center gap-3 p-4 bg-white shadow-sm">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <h1 className="font-semibold">Admin Panel</h1>
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
