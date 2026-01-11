"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function AnalysisCard({
  title,
  subtitle,
  icon,
  children,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
    >
      {(title || subtitle) && (
        <div className="mb-4 flex items-start gap-3">
          {icon && (
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {children}
    </motion.div>
  );
}
