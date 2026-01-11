"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ChartError() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[260px] flex-col items-center justify-center gap-3 text-center"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>

      <p className="text-sm sm:text-base text-red-500">
        Failed to load analytics data
      </p>

      <p className="text-xs sm:text-sm text-gray-400">
        Please try again later
      </p>
    </motion.div>
  );
}
