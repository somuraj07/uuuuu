import { ITransferCertificate } from "@/interfaces/schooladmin";
import { api } from "@/services/schooladmin/dashboard/dashboard.api";
import { calculateTodayAttendance } from "@/services/schooladmin/dashboard/dashboard.utils";
import { useEffect, useState, useCallback } from "react";


export const safeArray = <T>(value: any): T[] => {
  return Array.isArray(value) ? value : [];
};


export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    failedApis: string[];
  } | null>(null);

  /* ---------------- BASE STATE ---------------- */
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [attendanceRaw, setAttendanceRaw] = useState<any[]>([]);
  const [teacherLeaves, setTeacherLeaves] = useState<any[]>([]);
  const [teacherPendingLeaves, setTeacherPendingLeaves] = useState<any[]>([]);
  const [allTCRequests, setAllTCRequests] = useState<ITransferCertificate[]>([]);
  const [pendingTCRequests, setPendingTCRequests] = useState<ITransferCertificate[]>([]);
  const [feesCollected, setFeesCollected] = useState<number>(0);
  const [feeDetails, setFeeDetails] = useState<any[]>([]);
  const [feeStats, setFeeStats] = useState<any>(null);

  /* ---------------- DERIVED STATE ---------------- */
  const [stats, setStats] = useState<any>({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    upcomingWorkshops: 0,
    feesCollected: 0,
  });

  const [attendance, setAttendance] = useState<any>({
    student: { percent: 0, present: 0, absent: 0 },
    teacher: { percent: 0, onLeave: 0, present: 0 },
  });

  /* ---------------- DERIVED CALCULATIONS ---------------- */

  const recalculateStats = useCallback(() => {
    setStats({
      totalClasses: classes.length,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      upcomingWorkshops: events.length,
      feesCollected,
    });
  }, [classes, students, teachers, events, feesCollected]);

  const recalculateAttendance = useCallback(() => {
    setAttendance(
      calculateTodayAttendance(
        attendanceRaw,
        teachers.length ? teachers : [],
        teacherLeaves.length ? teacherLeaves : []
      )
    );
  }, [attendanceRaw, teachers, teacherLeaves]);

  /* ---------------- INITIAL LOAD ---------------- */

  const loadAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        classesRes,
        studentsRes,
        teachersRes,
        attendanceRes,
        feesRes,
        eventsRes,
        newsRes,
        leavesAll,
        leavesPending,
        tcRequestsAll,
        tcRequestsPending
      ] = await Promise.all([
        api.classes(),
        api.students(),
        api.teachers(),
        api.attendance(),
        api.fees(),
        api.events(),
        api.news(),
        api.leavesAll(),
        api.leavesPending(),
        api.tcRequestsAll(),
        api.tcRequestsPending()
      ]);

      setClasses(safeArray(classesRes?.classes));
      setStudents(safeArray(studentsRes?.students));
      setTeachers(safeArray(teachersRes?.teachers));
      setAttendanceRaw(safeArray(attendanceRes?.attendances));
      setEvents(safeArray(eventsRes?.events));
      setNews(safeArray(newsRes?.newsFeeds));
      setTeacherLeaves(safeArray(leavesAll));
      setTeacherPendingLeaves(safeArray(leavesPending));
      setFeesCollected(feesRes?.stats?.totalCollected ?? 0);
      setFeeStats(feesRes?.stats ?? null);
      setFeeDetails(safeArray(feesRes?.fees));
      setAllTCRequests(safeArray(tcRequestsAll?.tcs));
      setPendingTCRequests(safeArray(tcRequestsPending?.tcs));

    } catch {
      setError({
        message: "Failed to load dashboard data",
        failedApis: ["Dashboard"],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ---------------- AUTO RECOMPUTE DERIVED STATE ---------------- */

  useEffect(() => {
    if (!loading) {
      recalculateStats();
    }
  }, [loading, recalculateStats]);


  useEffect(() => {
    if (!loading) {
      recalculateAttendance();
    }
  }, [loading, recalculateAttendance]);


  /* ---------------- TAB-SCOPED RELOADS ---------------- */

  const reloadDashboard = async () => {
    try {
      const [
        classesRes,
        studentsRes,
        teachersRes,
        attendanceRes,
        feesRes,
        eventsRes,
        leavesAll,
      ] = await Promise.all([
        api.classes(),
        api.students(),
        api.teachers(),
        api.attendance(),
        api.fees(),
        api.events(),
        api.leavesAll(),
      ]);

      setClasses(classesRes?.classes ?? []);
      setStudents(studentsRes?.students ?? []);
      setTeachers(teachersRes?.teachers ?? []);
      setAttendanceRaw(attendanceRes?.attendances ?? []);
      setEvents(eventsRes?.events ?? []);
      setTeacherLeaves(leavesAll ?? []);
      setFeesCollected(feesRes?.stats?.totalCollected ?? 0);
    } catch {
      setError({
        message: "Failed to reload dashboard",
        failedApis: ["Dashboard"],
      });
    }
  };

  const reloadClasses = async () => {
    const res = await api.classes();
    setClasses(res?.classes ?? []);
  };

  const reloadStudents = async () => {
    const res = await api.students();
    setStudents(res?.students ?? []);
  };

  const reloadTeachers = async () => {
    const res = await api.teachers();
    setTeachers(res?.teachers ?? []);
  };

  const reloadLeaves = async () => {
    const [pending, all] = await Promise.all([
      api.leavesPending(),
      api.leavesAll(),
    ]);
    setTeacherPendingLeaves(pending ?? []);
    setTeacherLeaves(all ?? []);
  };

  const reloadTCRequests = async () => {
    const [pending, all] = await Promise.all([
      api.tcRequestsPending(),
      api.tcRequestsAll()
    ]);
    setPendingTCRequests(pending?.tcs ?? []);
    setAllTCRequests(all?.tcs ?? []);
  }

  /* ---------------- RETURN ---------------- */

  return {
    loading,
    error,

    // data
    stats,
    feeDetails,
    feeStats,
    attendance,
    classes,
    students,
    teachers,
    events,
    news,
    teacherLeaves,
    teacherPendingLeaves,
    tcRequestsAll: allTCRequests,
    tcRequestsPending: pendingTCRequests,

    // reloads
    reloadAll: loadAll,
    reloadDashboard,
    reloadClasses,
    reloadStudents,
    reloadTeachers,
    reloadLeaves,
    reloadTCRequests,
  };
}
