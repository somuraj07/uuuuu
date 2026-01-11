import { CheckCircle, AlertCircle, Users } from "lucide-react";
import AnimatedCard from "../common/AnimatedCard";
import { motion } from "framer-motion";

export default function FeeStats({ stats }: { stats: any }) {
  const items = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Pending Payments",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-100",
    },
    {
      label: "Fees Cleared",
      value: stats.paid,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      sub: `${stats.pending} students need to clear fees`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="will-change-transform"
        >
          <AnimatedCard className="h-full">
            <div className="p-5 flex items-center justify-between h-full">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>

                {item.sub && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.sub}
                  </p>
                )}
              </div>

              <div className={`p-3 rounded-full ${item.color}`}>
                <item.icon size={22} />
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      ))}
    </div>
  );
}
