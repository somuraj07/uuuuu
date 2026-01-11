import TableData from "@/components/ui/TableData";
import LeaveTypeBadge from "../LeaveTypeBadge";
import LeaveActionButtons from "../LeaveActionButtons";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function PendingLeavesTable({
  data,
  onAction,
  isTCApprovalsPage = false,
}: {
  data: any[];
  onAction: () => void;
  isTCApprovalsPage?: boolean;
}) {
  const columns = [
    {
      header: "Teacher",
      render: (row: any) => row.teacher?.name ?? "-",
    },
    {
      header: "Leave Type",
      render: (row: any) => <LeaveTypeBadge type={row.leaveType} />,
    },
    {
      header: "From",
      render: (row: any) => formatDate(row.fromDate),
    },
    {
      header: "To",
      render: (row: any) => formatDate(row.toDate),
    },
    {
      header: "Actions",
      render: (row: any) => (
        <div className="flex gap-2 min-w-[160px]">
          <LeaveActionButtons id={row.id} onSuccess={onAction} isTCApprovalsPage={isTCApprovalsPage} />
        </div>
      ),
    },
  ];

  const columnsForTCPendingsTable = [
    {
      header: "Student",
      render: (row: any) => row.requestedBy.name,
    },
    {
      header: "Class",
      render: (row: any) =>
        `${row.student?.class?.name}-${row.student?.class?.section}`,
    },
    {
      header: "Roll No",
      render: (row: any) => row.student?.rollNo ?? "-",
    },
    {
      header: "Reason",
      render: (row: any) => row.reason,
    },
    {
      header: "Requested On",
      render: (row: any) => formatDate(row.createdAt),
    },
    {
      header: "Actions",
      render: (row: any) => (
        <div className="flex gap-2 min-w-[160px]">
          <LeaveActionButtons id={row.id} onSuccess={onAction} isTCApprovalsPage={isTCApprovalsPage} />
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 overflow-x-auto">
      <h2 className="font-semibold mb-1">Pending Approvals</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {data.length} requests waiting for approval
      </p>

      <TableData
        columns={isTCApprovalsPage ? columnsForTCPendingsTable : columns}
        data={data}
      />
    </div>
  );
}
