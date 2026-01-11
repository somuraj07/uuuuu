import { MAIN_COLOR } from "@/constants/colors";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DateSelector({ selectedDate, onChange }: any) {
  const days = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - 2 + i);
    return formatLocalDate(d);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-gray-900">Select Date</p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ChevronLeft size={16} />
          {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          <ChevronRight size={16} />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            style={
              d === selectedDate
                ? { backgroundColor: MAIN_COLOR, color: "white" }
                : undefined
            }
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              d === selectedDate
                ? "shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {new Date(d + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
