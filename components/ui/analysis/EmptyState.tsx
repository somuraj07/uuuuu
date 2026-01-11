"use client";

import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  text: string;
}

export default function EmptyState({ text }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[260px] flex-col items-center justify-center gap-3 text-center"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
        <BarChart3 className="h-6 w-6 text-gray-400" />
      </div>

      <p className="text-sm sm:text-base text-gray-500 max-w-xs">
        {text}
      </p>
    </motion.div>
  );
}
