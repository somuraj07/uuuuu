"use client";

import ParentDashboardLayout from "@/app/pages/parent/dashboard/Dashboard";
import SuperAdminLayout from "@/app/pages/superadmin/dashboard/DashBoard";
import RequireRole from "@/components/RequireRole";
import { StudentProvider } from "@/context/StudentContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return null; 
  }

  return (
    <RequireRole allowedRoles={["STUDENT"]}>
      <StudentProvider>
        <ParentDashboardLayout/>
      </StudentProvider>
    </RequireRole>
  );
}
