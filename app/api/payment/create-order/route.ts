import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Razorpay has been removed. All payments are now manual.
  // Admin can add payments through the student lookup page.
  return NextResponse.json(
    { error: "Online payment gateway is disabled. Please contact admin for manual payment." },
    { status: 503 }
  );
}
