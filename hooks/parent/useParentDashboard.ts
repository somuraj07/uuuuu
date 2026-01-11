"use client";

import { useEffect, useState, useCallback } from "react";
import { useStudentContext } from "@/context/StudentContext";
import { parentApi } from "@/services/parent/parent.api";
import { safeArray } from "../useSchoolAdminDashboard";
import { api } from "@/services/schooladmin/dashboard/dashboard.api";
import { NewsFeed, StudentFeeApiResponse } from "@/interfaces/student";

export function useParentDashboardData() {
  const { activeStudent } = useStudentContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    failedApis: string[];
  } | null>(null);

  /* ---------------- BASE STATE ---------------- */
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [attendanceRaw, setAttendanceRaw] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [feesAllRes, setFeesAllRes] = useState<StudentFeeApiResponse>();
  const [news, setNews] = useState<NewsFeed[]>([]);

  /* ---------------- DERIVED STATE ---------------- */
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    percent: 0,
  });

  /* ---------------- DERIVED CALCULATIONS ---------------- */

  const recalculateAttendance = useCallback(() => {
    const normalized = attendanceRaw.map(a => ({
      ...a,
      status: String(a.status).toUpperCase().trim(),
    }));

    const present = normalized.filter(a => a.status === "PRESENT").length;
    const absent = normalized.filter(a => a.status === "ABSENT").length;
    const late = normalized.filter(a => a.status === "LATE").length;

    const total = normalized.length;

    setAttendanceStats({
      present,
      absent,
      late,
      percent: total ? Math.round(((present + late) / total) * 100) : 0,
    });
  }, [attendanceRaw]);


  /* ---------------- LOAD ALL (CORE) ---------------- */

  const loadAll = useCallback(async () => {
    if (!activeStudent?.id) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // FUTURE READY:
      // today -> backend ignores studentId
      // tomorrow -> backend filters by studentId
      const studentId = activeStudent?.id;

      const [
        homeworkRes,
        attendanceRes,
        marksRes,
        eventsRes,
        certificatesRes,
        feesRes,
        appointmentsRes,
        newsRes,
        teachersRes
      ] = await Promise.all([
        parentApi.homeworks(studentId),
        parentApi.attendance(studentId),
        parentApi.marks(studentId),
        parentApi.events(studentId),
        parentApi.certificates(studentId),
        parentApi.fees(studentId),
        parentApi.appointments(),
        parentApi.news(),
        api.teachers()
      ]);

      setHomeworks(safeArray(homeworkRes?.homeworks));
      setAttendanceRaw(safeArray(attendanceRes?.attendances));
      setMarks(safeArray(marksRes?.marks));
      setEvents(safeArray(eventsRes?.events));
      setCertificates(safeArray(certificatesRes?.certificates));
      setFees(feesRes?.fee ?? null);
      setFeesAllRes(feesRes as StudentFeeApiResponse);
      setAppointments(safeArray(appointmentsRes?.appointments));
      setNews(safeArray(newsRes?.news));
      setTeachers(safeArray(teachersRes?.teachers));
    } catch {
      setError({
        message: "Failed to load parent dashboard data",
        failedApis: ["ParentDashboard"],
      });
    } finally {
      setLoading(false);
    }
  }, [activeStudent?.id]);

  /* ---------------- AUTO LOAD ON STUDENT CHANGE ---------------- */

  useEffect(() => {
    if (activeStudent?.id) {
      loadAll();
    }
  }, [activeStudent?.id, loadAll]);


  /* ---------------- AUTO DERIVED ---------------- */

  useEffect(() => {
    recalculateAttendance();
  }, [attendanceRaw, recalculateAttendance]);


  /* ---------------- TAB-LEVEL RELOADS ---------------- */

  const reloadHomework = async () => {
    const res = await parentApi.homeworks(activeStudent?.id);
    setHomeworks(safeArray(res?.homeworks));
  };

  const reloadFee = async () => {
    const res = await parentApi.fees(activeStudent?.id);
    setFeesAllRes(res as StudentFeeApiResponse);
    setFees(res?.fee ?? null);
  };

  const reloadAppointments = async () => {
    const res = await parentApi.appointments();
    setAppointments(safeArray(res?.appointments));
  }

  const reloadAttendance = async () => {
    const res = await parentApi.attendance(activeStudent?.id);
    setAttendanceRaw(safeArray(res?.attendances));
  };

  const reloadMarks = async () => {
    const res = await parentApi.marks(activeStudent?.id);
    setMarks(safeArray(res?.marks));
  };

  /* ---------------- RETURN ---------------- */

  return {
    loading,
    error,

    // raw data
    homeworks,
    attendanceRaw,
    marks,
    events,
    certificates,
    fees,
    appointments,
    teachers,
    feesAllRes,
    news,

    // derived
    attendanceStats,

    // reloads
    reloadAll: loadAll,
    reloadHomework,
    reloadAttendance,
    reloadMarks,
    reloadAppointments,
    reloadFee
  };
}
