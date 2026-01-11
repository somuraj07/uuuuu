import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: {
          include: {
            school: true,user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: payments.map((p) => ({
        id: p.id,
        studentName: p.student.user?.name,
        schoolName: p.student.school.name,
        amount: p.amount,
        status: p.status,
        date: p.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
