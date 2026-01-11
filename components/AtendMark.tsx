"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, CheckCircle, XCircle, Percent } from "lucide-react"; // <-- icons imported

/* ---------------- LOADER ---------------- */
function PageLoader() {
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

/* ---------------- TYPES ---------------- */
type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface Student {
  id: string;
  rollNo?: string;
  user: { name: string | null };
}

interface Class {
  id: string;
  name: string;
  section: string | null;
}

/* ---------------- COMPONENT ---------------- */
export default function AttendanceManagementPage() {
  const { data: session, status } = useSession();

  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    {}
  );

  const [selectedClass, setSelectedClass] = useState("");
  const [period, setPeriod] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  /* ---------------- FETCH CLASSES ---------------- */
  useEffect(() => {
    if (session?.user?.role === "TEACHER") {
      setPageLoading(true);
      fetch("/api/class/list")
        .then((r) => r.json())
        .then((d) => setClasses(d.classes || []))
        .finally(() => setPageLoading(false));
    }
  }, [session]);

  /* ---------------- LOAD ATTENDANCE ---------------- */
  useEffect(() => {
    if (!selectedClass || !period) return;
    loadAttendanceData();
  }, [selectedClass, date, period]);

  const loadAttendanceData = async () => {
    setPageLoading(true);
    setSubmitted(false);
    setMessage("");

    const res = await fetch(
      `/api/attendance/view?classId=${selectedClass}&date=${date}`
    );
    const data = await res.json();

    if (!res.ok) {
      setPageLoading(false);
      return;
    }

    const periodRecords = (data.attendances || []).filter(
      (a: any) => a.period === period
    );

    if (periodRecords.length > 0) {
      const studentsFromDB: Student[] = [];
      const attendanceMap: Record<string, AttendanceStatus> = {};

      periodRecords.forEach((a: any, index: number) => {
        studentsFromDB.push({
          id: a.student.id,
          rollNo: a.student.rollNo || `ST${String(index + 1).padStart(3, "0")}`,
          user: { name: a.student.user.name },
        });
        attendanceMap[a.student.id] = a.status;
      });

      setStudents(studentsFromDB);
      setAttendance(attendanceMap);
      setSubmitted(true);
      setPageLoading(false);
      return;
    }

    setStudents([]);
    setAttendance({});
    setPageLoading(false);

    if (isToday) fetchStudents();
  };

  const fetchStudents = async () => {
    setPageLoading(true);
    const res = await fetch(`/api/class/students?classId=${selectedClass}`);
    const data = await res.json();

    if (res.ok) {
      const studentsWithRollNo: Student[] = data.students.map(
        (s: Student, index: number) => ({
          ...s,
          rollNo: s.rollNo || `ST${String(index + 1).padStart(3, "0")}`,
        })
      );
      setStudents(studentsWithRollNo);

      const initial: Record<string, AttendanceStatus> = {};
      studentsWithRollNo.forEach((s) => (initial[s.id] = "PRESENT"));
      setAttendance(initial);
    }
    setPageLoading(false);
  };

  /* ---------------- STATS ---------------- */
  const stats = useMemo(() => {
    const total = students.length || 0;
    const present = Object.values(attendance).filter(
      (s) => s === "PRESENT"
    ).length;
    const absent = Object.values(attendance).filter(
      (s) => s === "ABSENT"
    ).length;
    const percentage = total ? ((present / total) * 100).toFixed(1) : "0";

    return { total, present, absent, percentage };
  }, [attendance, students]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const payload = Object.entries(attendance).map(
      ([studentId, status]) => ({ studentId, status })
    );

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId: selectedClass,
        date,
        period,
        attendances: payload,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setMessage("Attendance submitted successfully");
    }
    setLoading(false);
  };

  /* ---------------- GUARDS ---------------- */
  if (status === "loading" || pageLoading) return <PageLoader />;
  if (!session) return <p className="p-6 text-red-600">Not authenticated</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500 text-sm">
            Track and manage student attendance
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-3 gap-4">
          <select
            className="border rounded-lg px-4 py-2"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.section && `- ${c.section}`}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-4 py-2"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
              <option key={p} value={p}>Period {p}</option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={stats.total} icon={<User size={20} />} />
          <StatCard title="Present" value={stats.present} green icon={<CheckCircle size={20} />} />
          <StatCard title="Absent" value={stats.absent} red icon={<XCircle size={20} />} />
          <StatCard title="Attendance %" value={`${stats.percentage}%`} purple icon={<Percent size={20} />} />
        </div>

        {/* TABLE */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-4 text-left">Roll No</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Status</th>
                  {isToday && !submitted && (
                    <th className="p-4 text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t transition hover:bg-gray-100"
                  >
                    <td className="p-4">{s.rollNo}</td>
                    <td className="p-4">{s.user.name}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${attendance[s.id] === "PRESENT"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {attendance[s.id].toLowerCase()}
                      </span>
                    </td>


                    {/* Actions */}
                    {isToday && !submitted && (
                      <td className="p-4 flex gap-2">
                        <button
                        
                          onClick={() =>
                            setAttendance({ ...attendance, [s.id]: "PRESENT" })
                          }
                          className="bg-green-500 hover:bg-green-600 transition transform hover:scale-105 text-white p-2 rounded-lg flex items-center justify-center"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setAttendance({ ...attendance, [s.id]: "ABSENT" })
                          }
                          className="bg-red-500 hover:bg-red-600 transition transform hover:scale-105 text-white p-2 rounded-lg flex items-center justify-center"
                        >
                          <XCircle size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && <p className="text-green-600">{message}</p>}

        {isToday && students.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={submitted || loading}
            className={`px-6 py-2 rounded-lg text-white transition ${submitted ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {submitted ? "Submitted" : loading ? "Saving..." : "Save Attendance"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */
function StatCard({ title, value, green, red, purple, icon }: any) {
  // Determine colors for border, icon bg, and icon color
  const borderColor = green
    ? "border-green-500"
    : red
      ? "border-red-500"
      : purple
        ? "border-purple-500"
        : "border-blue-500";

  const iconBg = green
    ? "bg-green-100"
    : red
      ? "bg-red-100"
      : purple
        ? "bg-purple-100"
        : "bg-blue-100";

  const iconColor = green
    ? "text-green-500"
    : red
      ? "text-red-500"
      : purple
        ? "text-purple-500"
        : "text-blue-500";

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow border ${borderColor} transition hover:shadow-lg flex items-center justify-between`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div
        className={`p-2 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
    </div>
  );
}