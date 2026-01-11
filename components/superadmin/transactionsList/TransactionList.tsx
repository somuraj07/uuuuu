"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, CalendarDays } from "lucide-react";
import DataTable from "@/components/ui/TableData";
export type Transaction = {
  id: string;
  studentName: string;
  schoolName: string;
  amount: number;
  status: string;
  date: string;
};
import { Column } from "@/components/ui/TableData";

export default function TransactionsListPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/superadmin/transactions");
      const json = await res.json();

      if (json.success) {
        setTransactions(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.schoolName.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);


const getTransactionsListColumns = (): Column<Transaction>[] => [
  {
    header: "Sl. No",
    render: (_: Transaction, index: number) =>
      String(index + 1).padStart(2, "0"),
  },
  {
    header: "Schools",
    render: (t: Transaction) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {t.schoolName}
        </span>
        <span className="text-xs text-gray-400">
          ₹{t.amount} • {t.status}
        </span>
      </div>
    ),
  },
];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Fee Transactions</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by School"
              className="pl-9 pr-4 py-2 border rounded-full text-sm outline-none"
            />
          </div>

          <button className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm text-gray-600">
            <CalendarDays size={16} />
            Today
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={getTransactionsListColumns()}
        data={filteredTransactions.length ? filteredTransactions : []}
        loading={loading}
        emptyText="No transactions found"
      />
    </div>
  );
}
