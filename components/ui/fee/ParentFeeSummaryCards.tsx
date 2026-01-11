"use client";

import { Wallet, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { StudentFee } from "@/interfaces/student";

export default function ParentFeeSummaryCards({ fee }: { fee: StudentFee }) {
  const percent =
    fee.finalFee > 0 ? Math.round((fee.amountPaid / fee.finalFee) * 100) : 0;

  const cards = [
    {
      label: "Total Fees",
      value: fee.finalFee,
      sub: "Academic Year",
      icon: Wallet,
      bg: "from-white to-green-50",
    },
 {
  label: "Paid",
  value: fee.amountPaid,
  sub: `${Math.round(
    (fee.amountPaid / fee.finalFee) * 100
  )}% Completed • ${fee.discountPercent}% Discount`,
  icon: CheckCircle,
  bg: "from-white to-emerald-50",
},

    {
      label: "Pending",
      value: fee.remainingFee,
      sub: "Remaining balance",
      icon: Clock,
      bg: "from-white to-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className={`rounded-2xl p-5 bg-gradient-to-br ${c.bg}
            shadow-sm hover:shadow-lg transition`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{c.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
            </div>
            <c.icon className="text-green-600" size={22} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
