"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, X } from "lucide-react";

type Attendance = {
  period: number;
  subject?: string;
  status?: "PRESENT" | "ABSENT" | "LATE";
  isBreak?: boolean;
};

export default function Schedule({
  data,
  loading,
}: {
  data: Attendance[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
        <p className="text-sm text-gray-500 text-center">Loading schedule…</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 text-center text-gray-500 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
        No schedule available for this date
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-white rounded-3xl p-6
        shadow-[0_12px_30px_rgba(0,0,0,0.05)]
      "
    >
      <h3 className="text-lg font-bold text-gray-900 mb-5">
        Selected day's Schedule
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => {
          if (item.isBreak) {
            return (
              <motion.div
                key={`break-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="
                  rounded-2xl px-5 py-4
                  bg-gray-100 text-gray-600
                  text-sm font-medium
                "
              >
                Lunch Break
              </motion.div>
            );
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="
                flex items-center justify-between
                rounded-2xl px-5 py-4
                bg-gray-50
                transition-all
              "
            >
              {/* Left content */}
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Period {item.period}
                </p>
                {/* <p className="text-xs text-gray-500 mt-0.5">
                  {item.subject ?? "—"}
                </p> */}
              </div>

              {/* Status pill */}
              {item.status === "PRESENT" && (
                <div className="flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle size={14} />
                  Present
                </div>
              )}

              {item.status === "ABSENT" && (
                <div className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                    <X size={14} />
                  Absent
                </div>
              )}

              {item.status === "LATE" && (
                <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <Clock size={14} />
                  Late
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
