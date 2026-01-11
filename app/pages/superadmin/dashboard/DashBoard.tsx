"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";
import DashboardPage from "@/components/superadmin/dashboard/Dashboard";
import AddSchoolPage from "@/components/superadmin/addschool/AddSchool";
import { SUPERADMIN_SIDEBAR_ITEMS } from "@/constants/superadmin/sidebar";
import { useSearchParams } from "next/navigation";
import SchoolsListPage from "@/components/superadmin/schoolsList/SchoolList";
import TransactionsListPage from "@/components/superadmin/transactionsList/TransactionList";

export default function SuperAdminLayout() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";


  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
  });
  const [schools, setSchools] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (tab !== "dashboard") return;

    fetch("/api/superadmin/dashboard")
      .then((r) => r.json())
      .then((r) => setStats(r.data));

    fetch("/api/superadmin/schools?limit=4")
      .then((r) => r.json())
      .then((r) => setSchools(r.data));

    fetch("/api/superadmin/transactions")
      .then((r) => r.json())
      .then((r) => setTransactions(r.data ? r.data.slice(0, 8) : []));
  }, [tab]);

  const renderPage = () => {
    if (tab === "dashboard") {
      return (
        <DashboardPage
          stats={stats}
          schools={schools}
          transactions={transactions}
        />
      );
    }

    if (tab === "schools") {
      return <SchoolsListPage />;
    }

    if (tab === "addschool") {
      return <AddSchoolPage />;
    }

    if (tab === "transactions") {
      return <TransactionsListPage />
    }

    return null;
  };

  return (
  <div className="h-screen flex flex-col animate-dashboard-container bg-[#f8fafc] min-h-screen">
  <TopNavbar />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar menuItems={SUPERADMIN_SIDEBAR_ITEMS} />
    <main className="flex-1 overflow-y-auto p-4">
      {renderPage()}
    </main>
  </div>
</div>
  );
}
