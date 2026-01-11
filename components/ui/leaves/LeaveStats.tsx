import { Calendar, Check, X } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    x: -40,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function LeaveStats({
  pending,
  approved,
  rejected,
}: {
  pending: number;
  approved: number;
  rejected: number;
}) {
  const stats = [
    { label: "Pending Requests", value: pending, icon: Calendar },
    { label: "Approved", value: approved, icon: Check },
    { label: "Rejected", value: rejected, icon: X },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4
      "
    >
      {stats.map(({ label, value, icon: Icon }) => (
        <motion.div
          key={label}
          variants={cardVariants}
          whileHover={{
            scale: 1.04,
            y: -4,
          }}
          whileTap={{ scale: 0.98 }}
          className="
            rounded-xl
            border border-emerald-200
            bg-emerald-50
            p-4 sm:p-5
            flex items-center justify-between
            transition-shadow
            hover:shadow-lg
            cursor-default
          "
        >
          {/* LEFT CONTENT */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {label}
            </p>

            <motion.p
              key={value}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="
                text-xl 
                sm:text-2xl 
                lg:text-3xl 
                font-bold
              "
            >
              {value}
            </motion.p>
          </div>

          {/* RIGHT ICON */}
          <motion.div
            whileHover={{ rotate: 6 }}
            className="
              bg-white 
              rounded-lg 
              p-2 sm:p-3
              flex items-center justify-center
            "
          >
            <Icon
              className="text-emerald-600"
              size={18}
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
