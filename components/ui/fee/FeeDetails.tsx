import DataTable from "@/components/ui/TableData";
import FeeStatusBadge from "./FeeStatusBadge";
import FeeMobileCards from "@/components/responsivescreens/schooladmin/FeeMobileCards";
import { MAIN_COLOR } from "@/constants/colors";


export default function FeeDetails({
  fees,
  loading,
}: {
  fees: any[];
  loading?: boolean;
}) {
    const feeColumns = [
  {
    header: "Roll No",
    render: (row: any) => row.rollNo || "-",
  },
  {
    header: "Student Name",
    render: (row: any) => (
      <div className="font-medium">{row.student.user.name}</div>
    ),
  },
  {
    header: "Total",
    render: (row: any) => `₹${row.totalFee}`,
  },
  {
    header: "Paid",
    render: (row: any) => (
      <span style={{ color: MAIN_COLOR }}>₹{row.amountPaid}</span>
    ),
  },
  {
    header: "Due",
    render: (row: any) => (
      <span className="text-red-600">₹{row.remainingFee}</span>
    ),
  },
  {
    header: "Status",
    render: (row: any) => (
      <FeeStatusBadge paid={row.remainingFee <= 0} />
    ),
  },
];
  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <DataTable
          columns={feeColumns}
          data={fees.length ? fees : []}
          loading={loading}
          emptyText="No fee records found"
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <FeeMobileCards fees={fees} />
      </div>
    </>
  );
}
