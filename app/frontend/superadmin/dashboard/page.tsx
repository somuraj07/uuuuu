"use client";

import SuperAdminLayout from "@/app/pages/superadmin/dashboard/DashBoard";
import RequireRole from "@/components/RequireRole";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminFinalPage() {
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
    <RequireRole allowedRoles={["SUPERADMIN"]}>
      <SuperAdminLayout />
    </RequireRole>
  );
}
