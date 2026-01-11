import { MAIN_COLOR } from "@/constants/colors";

export default function SchoolAdminAttendanceCard({
  title,
  percent,
  meta,
  color = `${MAIN_COLOR}`,
}: {
  title: string;
  percent: number;
  meta: string;
  color?: string;
}) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6">
      {/* Circular Progress */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(
            ${color} ${safePercent * 3.6}deg,
            #e5e7eb 0deg
          )`,
        }}
      >
        {/* Inner circle */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <span className="font-semibold text-gray-800">
            {safePercent}%
          </span>
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{meta}</p>
      </div>
    </div>
  );
}
