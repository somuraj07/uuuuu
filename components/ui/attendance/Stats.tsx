import { MAIN_COLOR } from "@/constants/colors";
import { motion } from "framer-motion";
import { Check, X, Clock } from "lucide-react";

export default function Stats({ stats }: any) {
  const cards = [
    {
      label: "Present",
      value: `${stats.presentPercent}%`,
      icon: Check,
      bg: "from-green-50 to-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Absent",
      value: stats.absent,
      icon: X,
      bg: "from-gray-50 to-gray-100",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      label: "Late",
      value: stats.late,
      icon: Clock,
      bg: "from-green-50 to-emerald-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } },
      }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-5"
    >
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            className={`
              relative overflow-hidden
              rounded-2xl p-5
              bg-gradient-to-br ${MAIN_COLOR}
              shadow-[0_12px_30px_rgba(0,0,0,0.06)]
              transition-all
            `}
          >
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>

              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className={card.iconColor} size={20} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
