import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const date = searchParams.get("date");

    let schoolId = session.user.schoolId;

    if (!schoolId) {
      const userSchool = await prisma.school.findFirst({
        where: {
          OR: [
            { admins: { some: { id: session.user.id } } },
            { teachers: { some: { id: session.user.id } } },
          ],
        },
        select: { id: true },
      });
      schoolId = userSchool?.id ?? null;
    }

    if (!schoolId) {
      return NextResponse.json(
        { message: "School not found in session" },
        { status: 400 }
      );
    }

    const where: any = { schoolId };

    // If teacher, only show their own attendance
    if (session.user.role === "TEACHER") {
      where.teacherId = session.user.id;
    } else if (teacherId) {
      // Admin can filter by teacher
      where.teacherId = teacherId;
    }

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      where.date = dateObj;
    }

    const attendances = await prisma.teacherAttendance.findMany({
      where,
      include: {
        teacher: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ attendances }, { status: 200 });
  } catch (error: any) {
    console.error("List teacher attendance error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
