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

    if (session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Only teachers can mark their attendance" },
        { status: 403 }
      );
    }

    let schoolId = session.user.schoolId;

    if (!schoolId) {
      const teacherSchool = await prisma.school.findFirst({
        where: { teachers: { some: { id: session.user.id } } },
        select: { id: true },
      });
      schoolId = teacherSchool?.id ?? null;
    }

    if (!schoolId) {
      return NextResponse.json(
        { message: "School not found in session" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { selfie, latitude, longitude, locationAddress, status, remarks } = body;

    if (!selfie) {
      return NextResponse.json(
        { message: "Selfie is required" },
        { status: 400 }
      );
    }

    // Get today's date (date only, no time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked for today
    const existing = await prisma.teacherAttendance.findUnique({
      where: {
        teacherId_date: {
          teacherId: session.user.id,
          date: today,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Attendance already marked for today" },
        { status: 409 }
      );
    }

    const attendance = await prisma.teacherAttendance.create({
      data: {
        teacherId: session.user.id,
        schoolId,
        date: today,
        selfie, // Base64 encoded selfie image string
        latitude: latitude || null,
        longitude: longitude || null,
        locationAddress: locationAddress || null,
        status: status || "PRESENT",
        remarks: remarks || null,
      },
      include: {
        teacher: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error: any) {
    console.error("Mark teacher attendance error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Attendance already marked for today" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
