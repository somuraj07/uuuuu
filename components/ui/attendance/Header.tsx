import { motion } from "framer-motion";
import { CheckCircle, Calendar } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="
        relative overflow-hidden
        rounded-3xl p-6
        bg-gradient-to-br from-white via-white to-green-50
        shadow-[0_20px_40px_rgba(0,0,0,0.04)]
      "
    >
      {/* subtle gradient glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 bg-green-100 rounded-full blur-3xl opacity-50" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Calendar className="text-green-600" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Attendance
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              A composed view of consistency and discipline.
            </p>
          </div>
        </div>

        <div className="h-14 w-14 rounded-full border border-green-200 flex items-center justify-center">
          <CheckCircle className="text-green-500" size={28} />
        </div>
      </div>
    </motion.div>
  );
}
