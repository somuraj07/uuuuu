"use client";

import { motion } from "framer-motion";
import { containerVariants } from "@/constants/parent/animations";
import StatsCards from "./StatsCards";
import PendingRequests from "./PendingRequests";
import RequestCertificateForm from "./RequestCertificateForm";
import ImportantInfo from "./ImportantInfo";
import { useState } from "react";
import { FileText } from "lucide-react";

export default function ParentCertificates() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center space-x-3 mb-2">
          <FileText size={35} className="text-green-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Certificates
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Request and manage your certificates in a calm, premium interface.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestCertificateForm />
        <PendingRequests refreshKey={refreshKey} />
      </div>

      <ImportantInfo />
    </motion.div>
  );
}
