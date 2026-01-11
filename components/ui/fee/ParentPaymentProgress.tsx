"use client";

import { motion } from "framer-motion";
import { StudentFee } from "@/interfaces/student";

export default function ParentPaymentProgress({ fee }: { fee: StudentFee }) {
  const percent =
    fee.finalFee > 0 ? (fee.amountPaid / fee.finalFee) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-gray-700">Payment Progress</p>
        <p className="text-sm text-gray-500">
          ₹{fee.amountPaid} / ₹{fee.finalFee}
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {Math.round(percent)}% Completed
      </p>

      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          className="h-full bg-green-600"
        />
      </div>
    </div>
  );
}
