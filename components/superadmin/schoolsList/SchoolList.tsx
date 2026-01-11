"use client";

import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "@/components/ui/TableData";
import { Column } from "@/components/ui/TableData";
import Checkbox from "@/components/ui/common/checkbox";
import { useDebounce } from "@/hooks/useDebounce";

type School = {
  id: string;
  name: string;
  studentCount: number;
  admin: {
    name: string | null;
    email: string | null;
    mobile: string | null;
  } | null;
};

export default function SchoolsListPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const totalPages = Math.ceil(total / limit);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchSchools();
  }, [page, debouncedSearch]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/superadmin/schools?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );

      const json = await res.json();

      if (json.success) {
        setSchools(json.data);
        setTotal(json.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const columns: Column<School>[] = [
    {
      header: "",
      render: (school) => (
        <Checkbox
          checked={selected.includes(school.id)}
          onChange={() => toggleSelect(school.id)}
          isWhiteBorder={false}
        />
      ),
      align: "center",
    },
    {
      header: "Admin Id",
      render: (_school, index) =>
        String((page - 1) * limit + index + 1).padStart(2, "0"),
    },
    {
      header: "School Name",
      render: (school) => school.name,
    },
    {
      header: "Admin Name",
      render: (school) => school.admin?.name ?? "-",
    },
    {
      header: "Contact",
      render: (school) => school.admin?.mobile ?? "-",
    },
    {
      header: "Admin Role",
      render: () => "School Admin",
    },
    {
      header: "Email",
      render: (school) => (
        <span className="text-green-600 underline">
          {school.admin?.email ?? "-"}
        </span>
      ),
    },
    {
      header: "Total No of Students",
      render: (school) => school.studentCount,
    },
    {
      header: "Delete",
      render: () => (
        <Trash2
          size={16}
          className="text-gray-400 hover:text-red-500 cursor-pointer"
        />
      ),
      align: "center",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Schools</h2>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by School"
            className="pl-9 pr-4 py-2 border rounded-full text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={schools.length ? schools : []}
        loading={loading}
        emptyText="No schools found"
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="border px-3 py-1 rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {schools.length ? page : 0} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-1 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
