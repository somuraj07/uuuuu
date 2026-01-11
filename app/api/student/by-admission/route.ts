import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SCHOOLADMIN" && session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { message: "Only admins can access student details" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const admissionNo = searchParams.get("admissionNo");

    if (!admissionNo) {
      return NextResponse.json(
        { message: "Admission number is required" },
        { status: 400 }
      );
    }

    let schoolId = session.user.schoolId;

    if (!schoolId) {
      const adminSchool = await prisma.school.findFirst({
        where: { admins: { some: { id: session.user.id } } },
        select: { id: true },
      });
      schoolId = adminSchool?.id ?? null;
    }

    if (!schoolId) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 400 }
      );
    }

    // Find student by admission number
    const student = await prisma.student.findFirst({
      where: {
        AdmissionNo: admissionNo,
        schoolId: schoolId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        class: {
          select: { id: true, name: true, section: true },
        },
        fee: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
        marks: {
          include: {
            exam: {
              select: { id: true, name: true },
            },
            teacher: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        attendances: {
          orderBy: { date: "desc" },
          take: 30, // Last 30 attendance records
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found with this admission number" },
        { status: 404 }
      );
    }

    // Calculate attendance stats
    const totalAttendance = student.attendances.length;
    const presentCount = student.attendances.filter((a) => a.status === "PRESENT").length;
    const absentCount = student.attendances.filter((a) => a.status === "ABSENT").length;
    const lateCount = student.attendances.filter((a) => a.status === "LATE").length;
    const attendancePercent = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    // Get all exams for the school
    const exams = await prisma.exam.findMany({
      where: {
        schoolId: schoolId,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate performance stats
    const marksByExam = exams.map((exam) => {
      const examMarks = student.marks.filter((m) => m.examId === exam.id);
      const totalMarks = examMarks.reduce((sum, m) => sum + m.marks, 0);
      const averageMarks = examMarks.length > 0 ? totalMarks / examMarks.length : 0;
      return {
        examId: exam.id,
        examName: exam.name,
        marks: examMarks,
        averageMarks,
        totalSubjects: examMarks.length,
      };
    });

    return NextResponse.json({
      student: {
        id: student.id,
        userId: student.userId,
        name: student.user.name,
        email: student.user.email,
        AdmissionNo: student.AdmissionNo,
        fatherName: student.fatherName,
        aadhaarNo: student.aadhaarNo,
        phoneNo: student.phoneNo,
        rollNo: student.rollNo,
        dob: student.dob,
        address: student.address,
        class: student.class,
      },
      fee: student.fee,
      payments: student.payments,
      marks: student.marks,
      marksByExam,
      attendances: student.attendances,
      attendanceStats: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        percent: Math.round(attendancePercent * 100) / 100,
      },
      exams,
    });
  } catch (error: any) {
    console.error("Get student by admission error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
