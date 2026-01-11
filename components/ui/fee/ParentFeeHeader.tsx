"use client";

import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function ParentFeeHeader() {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        bg-white rounded-2xl p-6
        shadow-sm flex items-center justify-between
      "
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
          <CreditCard className="text-green-600" size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Fee Management
          </h2>
          <p className="text-sm text-gray-500">
            Track and manage your fee payments smoothly
          </p>
        </div>
      </div>

      {/* Optional right icon (bank-style) */}
      <div className="text-gray-300">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 10L12 3L21 10V20H3V10Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </motion.div>
  );
}
