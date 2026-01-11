export const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export function calculateTodayAttendance(
  attendanceData: any[],
  teachers: any[],
  leaves: any[]
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAttendances = attendanceData.filter(a =>
    isSameDay(new Date(a.date), today)
  );

  const present = todayAttendances.filter(a => a.status === "PRESENT").length;
  const total = todayAttendances.length;

  const teachersOnLeave = leaves.filter(l => {
    const from = new Date(l.fromDate);
    const to = new Date(l.toDate);
    return l.status === "APPROVED" && today >= from && today <= to;
  }).length;

  const totalTeachers = teachers.length;

  return {
    student: {
      percent: total ? Math.round((present / total) * 100) : 0,
      present,
      absent: total - present,
    },
    teacher: {
      percent: totalTeachers
        ? Math.round((teachersOnLeave / totalTeachers) * 100)
        : 0,
      onLeave: teachersOnLeave,
      present: totalTeachers - teachersOnLeave,
    },
  };
}
