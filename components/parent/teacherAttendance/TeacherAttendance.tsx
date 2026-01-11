"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle, MapPin, User } from "lucide-react";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

interface TeacherAttendance {
  id: string;
  date: string;
  status: string;
  teacher: { name: string | null; email: string | null };
  locationAddress: string | null;
  createdAt: string;
}

export default function ParentTeacherAttendancePage() {
  const [attendances, setAttendances] = useState<TeacherAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchTeacherAttendance();
  }, [selectedDate]);

  const fetchTeacherAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher-attendance/list?date=${selectedDate}`);
      const data = await res.json();
      if (res.ok) {
        setAttendances(data.attendances || []);
      }
    } catch (error) {
      console.error("Fetch teacher attendance error:", error);
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

  const todayAttendance = attendances.filter(
    (a) => new Date(a.date).toISOString().split("T")[0] === selectedDate
  );

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: MAIN_COLOR }}>
          <User size={24} />
          Teacher Attendance
        </h1>
        <p className="text-gray-600">View teacher attendance records</p>
      </div>

      {/* Date Selector */}
      <div className="glass-card rounded-2xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full md:w-auto border rounded-lg px-4 py-2 glass"
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Attendance List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : todayAttendance.length > 0 ? (
        <div className="space-y-4">
          {todayAttendance.map((attendance) => (
            <div
              key={attendance.id}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: ACCENT_COLOR + "40" }}
                  >
                    <User size={24} style={{ color: MAIN_COLOR }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {attendance.teacher.name || "Teacher"}
                    </h3>
                    <p className="text-sm text-gray-500">{attendance.teacher.email}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    attendance.status === "PRESENT"
                      ? "bg-green-100 text-green-700"
                      : attendance.status === "LATE"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {attendance.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(attendance.date)}</span>
                </div>
                {attendance.locationAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{attendance.locationAddress}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500">No teacher attendance records found for this date</p>
        </div>
      )}
    </div>
  );
}
