"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Camera, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

interface TeacherAttendance {
  id: string;
  date: string;
  status: string;
  selfie: string;
  teacher: {
    id: string;
    name: string | null;
    email: string | null;
  };
  createdAt: string;
}

interface Teacher {
  id: string;
  name: string | null;
  email: string | null;
}

export default function AdminTeacherAttendancePage() {
  const [attendances, setAttendances] = useState<TeacherAttendance[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedAttendance, setSelectedAttendance] = useState<TeacherAttendance | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchTeacherAttendance();
  }, [selectedDate, selectedTeacher]);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teacher/list");
      const data = await res.json();
      if (res.ok) {
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error("Fetch teachers error:", error);
    }
  };

  const fetchTeacherAttendance = async () => {
    try {
      setLoading(true);
      let url = `/api/teacher-attendance/list?date=${selectedDate}`;
      if (selectedTeacher) {
        url += `&teacherId=${selectedTeacher}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setAttendances(data.attendances || []);
      } else {
        toast.error(data.message || "Failed to fetch attendance");
      }
    } catch (error) {
      console.error("Fetch teacher attendance error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredAttendances = attendances.filter((a) => {
    const attendanceDate = new Date(a.date).toISOString().split("T")[0];
    return attendanceDate === selectedDate;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: MAIN_COLOR }}>
          Teacher Attendance
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all teacher attendance records with selfies
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" style={{ color: MAIN_COLOR }} />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2 transition"
              style={{ "--tw-ring-color": MAIN_COLOR } as React.CSSProperties}
            />
          </div>

          {/* Teacher Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" style={{ color: MAIN_COLOR }} />
              Filter by Teacher (Optional)
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2 transition"
              style={{ "--tw-ring-color": MAIN_COLOR } as React.CSSProperties}
            >
              <option value="">All Teachers</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name || teacher.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500">Loading attendance...</p>
        </div>
      ) : filteredAttendances.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500">No attendance records found for selected date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendances.map((attendance) => (
            <motion.div
              key={attendance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 cursor-pointer hover:glass-strong transition"
              onClick={() => setSelectedAttendance(attendance)}
            >
              {/* Teacher Info */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: MAIN_COLOR }}
                >
                  {attendance.teacher.name?.[0]?.toUpperCase() || "T"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {attendance.teacher.name || attendance.teacher.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(attendance.date)}
                  </p>
                </div>
                {attendance.status === "PRESENT" ? (
                  <CheckCircle size={24} style={{ color: MAIN_COLOR }} />
                ) : (
                  <XCircle size={24} className="text-red-600" />
                )}
              </div>

              {/* Selfie Preview */}
              {attendance.selfie && (
                <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: ACCENT_COLOR }}>
                  <img
                    src={attendance.selfie}
                    alt="Attendance selfie"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    attendance.status === "PRESENT"
                      ? "bg-purple-100"
                      : "bg-red-100 text-red-700"
                  }`}
                  style={attendance.status === "PRESENT" ? { color: MAIN_COLOR } : undefined}
                >
                  {attendance.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Full View */}
      {selectedAttendance && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedAttendance(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: MAIN_COLOR }}>
                Attendance Details
              </h2>
              <button
                onClick={() => setSelectedAttendance(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Teacher Info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                  style={{ backgroundColor: MAIN_COLOR }}
                >
                  {selectedAttendance.teacher.name?.[0]?.toUpperCase() || "T"}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedAttendance.teacher.name || selectedAttendance.teacher.email}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAttendance.teacher.email}</p>
                </div>
              </div>

              {/* Date & Status */}
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedAttendance.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedAttendance.status === "PRESENT"
                        ? "bg-purple-100"
                        : "bg-red-100 text-red-700"
                    }`}
                    style={selectedAttendance.status === "PRESENT" ? { color: MAIN_COLOR } : undefined}
                  >
                    {selectedAttendance.status}
                  </span>
                </div>
              </div>

              {/* Selfie */}
              {selectedAttendance.selfie && (
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <Camera size={16} />
                    Attendance Selfie
                  </p>
                  <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: ACCENT_COLOR }}>
                    <img
                      src={selectedAttendance.selfie}
                      alt="Attendance selfie"
                      className="w-full max-h-96 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
