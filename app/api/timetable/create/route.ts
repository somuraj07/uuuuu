import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      session.user.role === "SCHOOLADMIN" ||
      session.user.role === "SUPERADMIN";
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Only admins can create timetables" },
        { status: 403 }
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
        { message: "School not found in session" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { classId, dayOfWeek, period, subject, teacherId, startTime, endTime } =
      body;

    if (
      !classId ||
      typeof dayOfWeek !== "number" ||
      typeof period !== "number" ||
      !subject
    ) {
      return NextResponse.json(
        { message: "Missing required fields: classId, dayOfWeek, period, subject" },
        { status: 400 }
      );
    }

    // Verify class belongs to school
    const classData = await prisma.class.findFirst({
      where: { id: classId, schoolId },
    });

    if (!classData) {
      return NextResponse.json(
        { message: "Class not found in your school" },
        { status: 404 }
      );
    }

    // Verify teacher if provided
    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, schoolId, role: "TEACHER" },
      });

      if (!teacher) {
        return NextResponse.json(
          { message: "Teacher not found in your school" },
          { status: 404 }
        );
      }
    }

    // Check if timetable entry already exists
    const existing = await prisma.timetable.findUnique({
      where: {
        classId_dayOfWeek_period: {
          classId,
          dayOfWeek,
          period,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Timetable entry already exists for this class, day, and period" },
        { status: 409 }
      );
    }

    const timetable = await prisma.timetable.create({
      data: {
        classId,
        schoolId,
        dayOfWeek,
        period,
        subject,
        teacherId: teacherId || null,
        startTime: startTime || null,
        endTime: endTime || null,
      },
      include: {
        class: {
          select: { id: true, name: true, section: true },
        },
        teacher: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ timetable }, { status: 201 });
  } catch (error: any) {
    console.error("Create timetable error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Timetable entry already exists for this class, day, and period" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
