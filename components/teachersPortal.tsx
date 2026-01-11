"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, ClipboardList, Users,
  Newspaper, MessageSquare, CalendarDays, Menu, X
} from "lucide-react";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

type School = {
  id: string;
  name?: string;
  icon?: string | null;
};

// Component imports (Assuming these are correct in your structure)
import RequireRole from "./RequireRole";
import MarksEntryPage from "./MarksEntry";
import MarkAttendancePage from "./AtendMark";
import HomeworkPage from "./Homework";
import NewsFeedPage from "./NewsFeed";
import CommunicationPage from "@/app/communication/page";
import TeacherLeavesPage from "./teacherLeave";
import TeacherDashboard from "./teacherDashboard";
import TeacherSelfAttendancePage from "./TeacherSelfAttendance";

const actions = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "homework", label: "Homework", icon: GraduationCap }, 
  { id: "marks-entry", label: "Marks", icon: ClipboardList },
  { id: "attendance-mark", label: "Student Attendance", icon: Users },
  { id: "self-attendance", label: "My Attendance", icon: CalendarDays },
  { id: "newsfeed", label: "Newsfeed", icon: Newspaper },
  { id: "communication", label: "Parents Chat", icon: MessageSquare },
  { id: "leaves", label: "Leave", icon: CalendarDays },
];

export default function TeachersPage() {
  const { data: session, status } = useSession();
  const [active, setActive] = useState(actions[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [school, setSchool] = useState<School | null>(null);
  const [schoolName, setSchoolName] = useState<string>("Loading...");

  // Safely extract session data
  const userName = session?.user?.name || "User";
  const userSubject = (session?.user as any)?.subjectsTaught;
  const userRoleDisplay = userSubject ? `${userSubject} Teacher` : "Teacher";

  // Fetch school data
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await fetch("/api/school/mine", {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.school) {
          setSchool(data.school);
          setSchoolName(data.school.name || "School");
        }
      } catch (err) {
        console.error("Failed to fetch school", err);
      }
    };

    fetchSchool();
  }, []);

  const renderContent = (id: string) => {
    switch (id) {
      case "dashboard": return <RequireRole allowedRoles={["TEACHER"]}><TeacherDashboard /></RequireRole>;
      case "homework": return <RequireRole allowedRoles={["TEACHER"]}><HomeworkPage /></RequireRole>;
      case "marks-entry": return <RequireRole allowedRoles={["TEACHER"]}><MarksEntryPage /></RequireRole>;
      case "attendance-mark": return <RequireRole allowedRoles={["TEACHER"]}><MarkAttendancePage /></RequireRole>;
      case "self-attendance": return <RequireRole allowedRoles={["TEACHER"]}><TeacherSelfAttendancePage /></RequireRole>;
      case "newsfeed": return <RequireRole allowedRoles={["TEACHER"]}><NewsFeedPage /></RequireRole>;
      case "communication": return <RequireRole allowedRoles={["TEACHER"]}><CommunicationPage /></RequireRole>;
      case "leaves": return <RequireRole allowedRoles={["TEACHER"]}><TeacherLeavesPage /></RequireRole>;
      default: return <div className="p-20 text-gray-400">🚧 Feature under development</div>;
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "w-64" : "w-64"} relative bg-white h-full flex flex-col border-r border-gray-300`}>
      {/* TOP PROFILE / BRAND */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: MAIN_COLOR }}>
          {school?.icon ? (
            <img
              src={school.icon}
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-white font-bold">
              {schoolName?.[0] ?? "S"}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{schoolName}</p>
          <p className="text-xs text-gray-500">Teacher Portal</p>
        </div>
      </div>

      {/* SIDEBAR MENU */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {actions.map((item) => {
          const Icon = item.icon;
          const isActive = active.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => { setActive(item); setMobileOpen(false); }}
              whileHover={{ x: 3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isActive ? 1.06 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full mb-2 overflow-hidden rounded-xl"
            >
              {isActive && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ originY: 0, backgroundColor: ACCENT_COLOR + "60" }}
                  className="absolute inset-0"
                />
              )}
              <div
                className={`relative z-10 flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                  isActive ? "shadow-md" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className="text-lg"
                  style={{
                    color: isActive ? MAIN_COLOR : "#9ca3af",
                  }}
                />
                <span
                  style={{
                    color: isActive ? MAIN_COLOR : "#6b7280",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* BOTTOM PROFILE */}
      <div className="px-4 py-4 border-t border-gray-300 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: MAIN_COLOR }}>
          {userName.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userRoleDisplay}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 -right-6 h-full w-6 bg-gradient-to-r from-gray-300/40 via-gray-200/20 to-transparent" />
    </aside>
  );

  if (status === "loading") return <div className="h-screen flex items-center justify-center font-bold" style={{ color: "#8B5CF6" }}>Loading Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Sidebar />

      {/* NAVBAR WITH DYNAMIC NAME & ICON */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
            <Menu size={26} />
          </button>
          
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center p-1 shrink-0 overflow-hidden" style={{ backgroundColor: MAIN_COLOR }}>
              {school?.icon ? (
                <img src={school.icon} alt="School" className="h-full w-full object-contain" />
              ) : (
                <span className="text-white font-bold text-xs">
                  {schoolName?.[0] ?? "S"}
                </span>
              )}
            </div>
            <h2 className="text-sm font-semibold text-gray-800 truncate">
              {schoolName}
            </h2>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white" style={{ backgroundColor: "#8B5CF6" }}>
          {active.label}
        </span>
      </header>

      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0 bg-[#F8FAFB]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full bg-white"
          >
            {renderContent(active.id)}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="fixed inset-y-0 left-0 z-50 shadow-2xl">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}