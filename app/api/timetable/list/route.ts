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
    const classId = searchParams.get("classId");

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

    const where: any = { schoolId };
    if (classId) {
      where.classId = classId;
    }

    const timetables = await prisma.timetable.findMany({
      where,
      include: {
        class: {
          select: { id: true, name: true, section: true },
        },
        teacher: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { period: "asc" }],
    });

    return NextResponse.json({ timetables }, { status: 200 });
  } catch (error: any) {
    console.error("List timetables error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
