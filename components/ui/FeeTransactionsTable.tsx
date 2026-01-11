import DataTable, { Column } from "./TableData";

interface Transaction {
  id: string;
  schoolName: string;
}

export default function FeeTransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {

const getTransactionColumns = (): Column<Transaction>[] => [
  {
    header: "Sl. No",
    align: "center",
    render: (_: Transaction, index: number) =>
      String(index + 1).padStart(2, "0"),
  },
  {
    header: "Schools",
    render: (txn: Transaction) => (
      <div className="flex items-center gap-3 py-1">
        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <span className="text-gray-700">{txn.schoolName}</span>
      </div>
    ),
  },
];

  return (
      <DataTable
        columns={getTransactionColumns()}
        data={transactions.length ? transactions : []}
      />
   
  );
}
