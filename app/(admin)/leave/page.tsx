import AdminLeavesPage from "@/components/adminLeave";
import RequireRole from "@/components/RequireRole";

export default function AdminLeavesPages() {
  return (
    <RequireRole allowedRoles={["SCHOOLADMIN"]}>
          <AdminLeavesPage />
    </RequireRole>
  );
}