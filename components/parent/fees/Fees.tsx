"use client";

import { motion } from "framer-motion";
import { StudentFee, StudentFeeApiResponse } from "@/interfaces/student";
import FeeSummaryCards from "@/components/ui/fee/ParentFeeSummaryCards";
import PaymentProgress from "@/components/ui/fee/ParentPaymentProgress";
import InstallmentsList from "@/components/ui/fee/ParentFeeInstamentsList";
import ParentFeeHeader from "@/components/ui/fee/ParentFeeHeader";

export default function FeesTab({ fee, reloadFee, feesAllRes }: { fee: StudentFee, reloadFee: () => void, feesAllRes: StudentFeeApiResponse }) {
  if (!fee) {
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-500">
        Fee details not available. Please contact school admin.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24"
    >
      <ParentFeeHeader />
      <FeeSummaryCards fee={fee} />
      <PaymentProgress fee={fee} />
      <InstallmentsList fee={fee} feesAllRes={feesAllRes} />
    </motion.div>
  );
}
