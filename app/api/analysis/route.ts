import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const schoolId = session?.user?.schoolId;

  if (!schoolId) {
    return NextResponse.json([], { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parameter = searchParams.get("parameter");
  const period = searchParams.get("period");
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  /* ---------------- FEES ---------------- */
  if (parameter === "fees" && period === "yearly") {
    const payments = await prisma.payment.findMany({
      where: {
        student: { schoolId },
        createdAt: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
        },
      },
    });

    const map = new Map<number, number>();

    payments.forEach(p => {
      const m = p.createdAt.getMonth();
      map.set(m, (map.get(m) || 0) + p.amount);
    });

    return NextResponse.json(
      Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("default", { month: "short" }),
        value: map.get(i) || 0,
      }))
    );
  }

  /* ---------------- ATTENDANCE ---------------- */
  if (parameter === "attendance") {
    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        students: true,
        attendances: {
          where: {
            ...(period === "monthly" && {
              date: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 0),
              },
            }),
          },
        },
      },
    });

    const data = classes.map(cls => {
      const total = cls.students.length;
      const present = new Set(
        cls.attendances
          .filter(a => a.status === "PRESENT")
          .map(a => a.studentId)
      ).size;

      return {
        label: `${cls.name}${cls.section ? " - " + cls.section : ""}`,
        value: total ? Math.round((present / total) * 100) : 0,
      };
    });

    return NextResponse.json(data);
  }

  /* ---------------- ENROLLMENT ---------------- */
  if (parameter === "enrollment" && period === "yearly") {
    const students = await prisma.student.findMany({
      where: { schoolId },
      select: { createdAt: true },
    });

    let running = 0;

    const data = Array.from({ length: 12 }, (_, i) => {
      running += students.filter(s => s.createdAt.getMonth() === i).length;

      return {
        label: new Date(0, i).toLocaleString("default", { month: "short" }),
        value: running,
      };
    });

    return NextResponse.json(data);
  }

  return NextResponse.json([]);
}
