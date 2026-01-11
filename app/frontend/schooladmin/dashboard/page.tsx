"use client";

import SchoolAdminLayout from "@/app/pages/schooladmin/dashboard/Dashboard";
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
    <RequireRole allowedRoles={["SCHOOLADMIN"]}>
      <SchoolAdminLayout />
    </RequireRole>
  );
}
