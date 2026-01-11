import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [schoolsCount, studentsCount] = await Promise.all([
      prisma.school.count(),
      prisma.student.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSchools: schoolsCount,
        totalStudents: studentsCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
