import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    /* ---------- Auth ---------- */
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { message: "Only super admin can create schools" },
        { status: 403 }
      );
    }

    /* ---------- Body ---------- */
    const {
      name,
      address,
      location,
      icon,
      pincode,
      district,
      state,
      city,
      schoolAdminId, // 👈 important
    } = await req.json();

    if (!name || !address || !location || !pincode || !district || !state || !city) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    /* ---------- Create School ---------- */
    const school = await prisma.school.create({
      data: {
        name,
        address,
        location,
        icon,
        pincode,
        district,
        state,
        city,
        admins: schoolAdminId
          ? { connect: { id: schoolAdminId } }
          : undefined,
      },
    });

    /* ---------- Attach schoolId to School Admin ---------- */
    if (schoolAdminId) {
      await prisma.user.update({
        where: { id: schoolAdminId },
        data: { schoolId: school.id },
      });
    }

    return NextResponse.json(
      { message: "School created successfully", school },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create school error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
