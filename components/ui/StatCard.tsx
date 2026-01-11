import { LIGHT_BG_COLOR } from "@/constants/colors";

interface StatCardProps {
  title: string;
  value: number;
  iconBg?: string;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-[#43b771]",
}: StatCardProps) {
  return (
    <div style={{ backgroundColor: LIGHT_BG_COLOR }} className=" rounded-2xl p-6 flex justify-between items-center">
      <div>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}
