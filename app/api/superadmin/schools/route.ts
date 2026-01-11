import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Role } from "@/app/generated/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 8);
  const search = searchParams.get("search") ?? "";

  const skip = (page - 1) * limit;

  try {
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          students: true,
          admins: {
            where: { role: Role.SCHOOLADMIN },
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true,
            },
            take: 1, // only primary admin
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.school.count({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: schools.map((school) => ({
        id: school.id,
        name: school.name,
        admin: school.admins[0] ?? null,
        studentCount: school.students.length,
        createdAt: school.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
