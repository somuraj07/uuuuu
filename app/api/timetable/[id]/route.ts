import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

type RouteParams = { params: { id: string } } | { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: RouteParams) {
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
        { message: "Only admins can update timetables" },
        { status: 403 }
      );
    }

    const resolved = "then" in context.params ? await context.params : context.params;
    const id = resolved.id;

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

    const timetable = await prisma.timetable.findFirst({
      where: { id, schoolId },
    });

    if (!timetable) {
      return NextResponse.json(
        { message: "Timetable not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { subject, teacherId, startTime, endTime } = body;

    const updateData: any = {};
    if (subject !== undefined) updateData.subject = subject;
    if (teacherId !== undefined) updateData.teacherId = teacherId || null;
    if (startTime !== undefined) updateData.startTime = startTime || null;
    if (endTime !== undefined) updateData.endTime = endTime || null;

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

    const updated = await prisma.timetable.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: { id: true, name: true, section: true },
        },
        teacher: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ timetable: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Update timetable error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteParams) {
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
        { message: "Only admins can delete timetables" },
        { status: 403 }
      );
    }

    const resolved = "then" in context.params ? await context.params : context.params;
    const id = resolved.id;

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

    const timetable = await prisma.timetable.findFirst({
      where: { id, schoolId },
    });

    if (!timetable) {
      return NextResponse.json(
        { message: "Timetable not found" },
        { status: 404 }
      );
    }

    await prisma.timetable.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Timetable deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete timetable error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
