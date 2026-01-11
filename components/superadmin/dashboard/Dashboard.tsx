"use client";
import StatCard from "@/components/ui/StatCard";
import SectionCard from "@/components/ui/common/SectionCard";
import SchoolsMiniTable from "@/components/ui/SchoolsMiniTable";
import FeeTransactionsTable from "@/components/ui/FeeTransactionsTable";
import { FiUsers } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
export default function DashboardPage({stats, schools, transactions}: {stats: {totalSchools: number; totalStudents: number}; schools: any[]; transactions: any[]}) {
  

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-6">
              <StatCard
                title="Total No. of Schools"
                value={stats.totalSchools}
                icon={<HiOutlineAcademicCap />}
              />
              <StatCard
                title="Total No. of Students"
                value={stats.totalStudents}
                icon={<FiUsers />}
                iconBg="bg-purple-500"
              />
              <SectionCard title="Schools">
                <SchoolsMiniTable schools={schools} />
              </SectionCard>
            </div>

            {/* RIGHT */}
            <SectionCard title="Fee Transactions">
              <FeeTransactionsTable transactions={transactions} />
            </SectionCard>
          </div>
    </div>
  );
}
