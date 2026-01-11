"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle } from "lucide-react";
import PayButton from "@/components/PayButton";
import { StudentFee, StudentFeeApiResponse } from "@/interfaces/student";

export default function PayNowCard({
  fee,
  reloadFee,
  feesAllRes,
}: {
  fee: StudentFee;
  reloadFee: () => void;
  feesAllRes:StudentFeeApiResponse
}) {
  const [amount, setAmount] = useState<number | "">("");
  const [paying, setPaying] = useState(false);

  if (fee.remainingFee <= 0) {
    return (
      <div className="bg-green-50 rounded-2xl p-4 text-center text-green-700 font-semibold flex items-center justify-center gap-2">
        <CheckCircle size={18} /> All fees paid
      </div>
    );
  }

  const payable = amount === "" ? fee.remainingFee : Number(amount);
  const invalid =
    payable <= 0 || payable > fee.remainingFee || isNaN(payable);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl p-5 shadow-lg space-y-4"
    >
      <div className="flex items-center gap-2">
        <CreditCard className="text-green-600" size={20} />
        <h3 className="font-semibold text-gray-800">Make a Payment</h3>
      </div>

      {/* Amount Input */}
      <input
        type="number"
        value={amount}
        disabled={paying}
        max={fee.remainingFee}
        placeholder={`Enter amount (max ₹${fee.remainingFee})`}
        onChange={(e) => {
          const v = e.target.value === "" ? "" : Number(e.target.value);
          if (v !== "" && v > fee.remainingFee) return;
          setAmount(v);
        }}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-100"
      />

      {/* Summary */}
      <div className="flex justify-between text-sm p-3 rounded-xl">
        <span>Pay Now</span>
        <span className="font-bold text-green-700">
          ₹{payable.toFixed(2)}
        </span>
      </div>

      {invalid && (
        <p className="text-xs text-red-600 text-center">
          Enter valid amount
        </p>
      )}

      <PayButton
        amount={payable}
        feesAllRes={feesAllRes}
        disabled={invalid || paying}
        loading={paying}
        onStart={() => setPaying(true)}
        onSuccess={() => {
          setAmount("");      
          setPaying(false);   
          reloadFee();        
        }}
        onFailure={() => setPaying(false)}
      />
    </motion.div>
  );
}
