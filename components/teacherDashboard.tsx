"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  School,
  Users,
  MessageSquare,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

/* ================= TYPES (Unchanged) ================= */
interface Class {
  id: string;
  name: string;
  section?: string;
  _count: {
    students: number;
  };
}

interface Event {
  id: string;
  title?: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  student: {
    user: {
      name: string;
    };
  };
  message: string;
  createdAt: string;
}

/* ================= ANIMATION VARIANTS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOGIC (Unchanged) ================= */
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const dashboardRes = await fetch("/api/teacher/dashboard");
        const dashboardData = await dashboardRes.json();
        setClasses(dashboardData.classes ?? []);
        setAppointments(dashboardData.appointments ?? []);

        const eventsRes = await fetch("/api/events/list");
        const eventsData = await eventsRes.json();

        const mappedEvents = (eventsData.events ?? []).map((e: any) => ({
          id: e.id,
          title: e.title ?? "School Event",
          createdAt: e.createdAt,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Teacher dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#33b663] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const totalStudents = classes.reduce((sum, cls) => sum + cls._count.students, 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-h-screen bg-[#F8FAFB] p-8 md:p-12 font-sans overflow-hidden"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Welcome back, Teacher</p>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Classes", val: classes.length, icon: School, gradient: "from-[#E6F9F0] to-[#C7F0DB]", iconBg: "bg-[#B9E9D2]", color: "text-[#2D6A4F]" },
          { label: "Total Students", val: totalStudents, icon: Users, gradient: "from-[#E9F2FF] to-[#D1E4FF]", iconBg: "bg-[#B8D7FF]", color: "text-[#1E3A8A]" },
          { label: "Pending Chats", val: appointments.length, icon: MessageSquare, gradient: "from-[#FFFBEB] to-[#FEF3C7]", iconBg: "bg-[#FDE68A]", color: "text-[#92400E]" },
          { label: "Unread Messages", val: "2", icon: Bell, gradient: "from-[#F5F3FF] to-[#EDE9FE]", iconBg: "bg-[#DDD6FE]", color: "text-[#5B21B6]" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-6 shadow-sm border border-black/5 flex flex-col justify-between h-40 cursor-pointer group transition-shadow hover:shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div className={`${stat.iconBg} p-2.5 rounded-lg ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-[#33b663] opacity-60" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.val}</div>
              <div className="text-xs font-semibold text-gray-600/80 mt-0.5">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FIXED HEIGHT CONTENT AREA (80vh approx) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-380px)] min-h-[500px]">
        {/* Classes Handled - Scrollable */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800 px-2">Classes Handled</h2>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {classes.map((cls) => (
              <motion.div
                key={cls.id}
                whileHover={{ x: 6, backgroundColor: "#fdfdfd" }}
                className="flex justify-between items-center p-5 rounded-lg border border-gray-50 hover:border-[#33b663]/30 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <p className="font-bold text-gray-900 text-lg">{cls.name}</p>
                  <span className="text-[9px] font-black bg-[#33b663] text-white px-2.5 py-1 rounded-md uppercase tracking-widest">
                    {cls.section ?? "General"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 font-semibold">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span className="text-sm">{cls._count.students} students</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#33b663] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar Column - Scrollable */}
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex flex-col h-full">
          {/* Parent Chat Notifications */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-gray-800">Parent Chat</h2>
              <span className="bg-red-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full">
                {appointments.length}
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {appointments.slice(0, 2).map((a) => (
                  <motion.div
                    key={a.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-xs text-gray-900">{a.student.user.name}</h4>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mb-3">"{a.message}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-gray-300">
                        {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button className="bg-[#33b663] text-white text-[9px] font-black px-3 py-1 rounded-md uppercase">
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Upcoming Events - Timeline Logic */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 min-h-[250px]">
            <h2 className="text-base font-bold text-gray-800 mb-6">Upcoming Events</h2>
            <div className="space-y-6">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 bg-[#33b663] rounded-full group-hover:ring-4 ring-emerald-50 transition-all" />
                    <div className="w-[1px] h-full bg-gray-50 mt-1" />
                  </div>
                  <div className="pb-1">
                    <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#33b663] transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex gap-3 text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}