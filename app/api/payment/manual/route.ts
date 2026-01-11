import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SCHOOLADMIN" && session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { message: "Only admins can create manual payments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { studentId, amount } = body;

    if (!studentId || !amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Valid studentId and amount are required" },
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
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found or doesn't belong to your school" },
        { status: 404 }
      );
    }

    // Get current fee
    const fee = await prisma.studentFee.findUnique({
      where: { studentId },
    });

    if (!fee) {
      return NextResponse.json(
        { message: "Fee details not found for this student" },
        { status: 404 }
      );
    }

    // Update fee and create payment
    const newAmountPaid = fee.amountPaid + amount;
    const newRemaining = Math.max(fee.finalFee - newAmountPaid, 0);

    const [payment, updatedFee] = await Promise.all([
      prisma.payment.create({
        data: {
          studentId,
          amount,
          razorpayOrderId: `MANUAL_${Date.now()}`,
          razorpayPaymentId: `MANUAL_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          razorpaySignature: `MANUAL_${Date.now()}`,
          status: "SUCCESS",
        },
      }),
      prisma.studentFee.update({
        where: { studentId },
        data: {
          amountPaid: newAmountPaid,
          remainingFee: newRemaining,
        },
      }),
    ]);

    return NextResponse.json({ payment, fee: updatedFee }, { status: 201 });
  } catch (error: any) {
    console.error("Create manual payment error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
