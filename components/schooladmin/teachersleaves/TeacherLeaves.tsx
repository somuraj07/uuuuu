"use client";

import LeaveStats from "@/components/ui/leaves/LeaveStats";
import PendingLeavesTable from "@/components/ui/leaves/PendingLeavesTable";
import ProcessedLeavesTable from "@/components/ui/leaves/ProcessedLeavesTable";

export default function TeacherLeavesPage({
  allLeaves,
  pending,
  reload,
  loading,
  isTCApprovalsPage = false,
}: {
  allLeaves: any[];
  pending: any[];
  loading: boolean;
  isTCApprovalsPage?: boolean;
  reload: () => void;
}) {
  const approved = allLeaves.filter((l) => l.status === "APPROVED");
  const rejected = allLeaves.filter((l) => l.status === "REJECTED");  
  console.log(allLeaves, pending, approved, rejected);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Teacher Leaves</h1>
      <p className="text-sm text-muted-foreground">
        Review and manage teacher leave requests
      </p>

      <LeaveStats
        pending={pending.length}
        approved={approved.length}
        rejected={rejected.length}
      />

      <PendingLeavesTable data={pending} onAction={reload} isTCApprovalsPage={isTCApprovalsPage} />

      <ProcessedLeavesTable data={[...approved, ...rejected]} isTCApprovalsPage={isTCApprovalsPage} />
    </div>
  );
}
