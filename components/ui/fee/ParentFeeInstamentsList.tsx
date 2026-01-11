"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { StudentFee, StudentFeeApiResponse } from "@/interfaces/student";
import { generateFeeReceipt } from "@/components/parent/fees/utils";

export default function ParentFeeInstamentsList({
  fee,
  feesAllRes,
}: {
  fee: StudentFee;
  feesAllRes: StudentFeeApiResponse;
}) {
  if (!fee.installments || fee.installments <= 1) return null;

  const perInstallment = Math.ceil(fee.finalFee / fee.installments);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Installments</h3>
        <button className="text-sm text-green-600 hover:underline">
          View All Receipts
        </button>
      </div>

      {Array.from({ length: fee.installments }).map((_, i) => {
        const requiredPaidTillNow = perInstallment * (i + 1);
        const paid = fee.amountPaid >= requiredPaidTillNow;

        // Find the payment that completed this installment (best match)
        const paymentForThisInstallment = paid
          ? feesAllRes.payments.find(
              (p, index) =>
                fee.amountPaid >= perInstallment * (index + 1)
            )
          : null;

        return (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow transition"
          >
            <div>
              <p className="font-medium text-gray-800">Term {i + 1}</p>
              <p className="text-sm text-gray-500">₹{perInstallment}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  paid
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {paid ? "Paid" : "Pending"}
              </span>

              {paid && paymentForThisInstallment && (
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={() =>
                    generateFeeReceipt({
                      payment: paymentForThisInstallment,
                      student: feesAllRes.student,
                      school: feesAllRes.school,
                    })
                  }
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
