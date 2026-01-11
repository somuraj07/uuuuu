import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  bg: string;
  iconBg: string;
  index?: number;
}

export default function SchoolAdminStatCard({
  title,
  value,
  icon,
  bg,
  iconBg,
  index = 0,
}: Props) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl 
        p-6 min-h-[160px]
        ${bg}
        shadow-sm hover:shadow-lg
        transition-all duration-300
        hover:-translate-y-1
        animate-fade-in
      `}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* op-right trending icon (GREEN, no background) */}
      <div className="absolute top-4 right-4">
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      {/* 🌫️ Large faded background icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl">
        <div className={`h-10 h-10 text-gray-700 ${iconBg} rounded-full flex items-center justify-center p-2`}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h2 className="text-2xl font-bold mt-4 text-gray-900">{value}</h2>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
  );
}
