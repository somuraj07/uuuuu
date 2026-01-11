import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SCHOOLADMIN" && session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { message: "Only admins can update student details" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      studentId,
      name,
      fatherName,
      phoneNo,
      dob,
      address,
      rollNo,
      classId,
    } = body;

    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" },
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

    // Verify student belongs to the school
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId: schoolId,
      },
      include: {
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found or doesn't belong to your school" },
        { status: 404 }
      );
    }

    // Verify class if provided
    if (classId) {
      const classData = await prisma.class.findFirst({
        where: {
          id: classId,
          schoolId: schoolId,
        },
      });

      if (!classData) {
        return NextResponse.json(
          { message: "Class not found or doesn't belong to your school" },
          { status: 404 }
        );
      }
    }

    // Update user (name only)
    const userUpdateData: any = {};
    if (name) userUpdateData.name = name;

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: student.userId },
        data: userUpdateData,
      });
    }

    // Update student (everything except AdmissionNo)
    const studentUpdateData: any = {};
    if (fatherName !== undefined) studentUpdateData.fatherName = fatherName;
    if (phoneNo !== undefined) studentUpdateData.phoneNo = phoneNo;
    if (dob) studentUpdateData.dob = new Date(dob);
    if (address !== undefined) studentUpdateData.address = address;
    if (rollNo !== undefined) studentUpdateData.rollNo = rollNo;
    if (classId !== undefined) studentUpdateData.classId = classId || null;

    if (Object.keys(studentUpdateData).length > 0) {
      await prisma.student.update({
        where: { id: studentId },
        data: studentUpdateData,
      });
    }

    // Fetch updated student
    const updatedStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        class: {
          select: { id: true, name: true, section: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Student details updated successfully", student: updatedStudent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
