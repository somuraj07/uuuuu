import TableData from "@/components/ui/TableData";
import LeaveTypeBadge from "../LeaveTypeBadge";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ProcessedLeavesTable({
  data,
  isTCApprovalsPage,
}: {
  data: any[];
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
      header: "Status",
      render: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

    const columnsForTCProcessedTable = [
    {
      header: "Student",
      render: (row: any) => row.requestedBy?.name ?? "-",
    },
     {
      header: "Class",
      render: (row: any) =>
        `${row.student?.class?.name}-${row.student?.class?.section}`,
    },
    {
      header: "Reason",
      render: (row: any) => row.reason,
    },
    {
      header: "Status",
      render: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 overflow-x-auto">
      <h2 className="font-semibold mb-1">Processed Requests</h2>
      <p className="text-sm text-muted-foreground mb-4">
        History of approved and rejected requests
      </p>

      <TableData columns={isTCApprovalsPage ? columnsForTCProcessedTable : columns} data={data} />
    </div>
  );
}
