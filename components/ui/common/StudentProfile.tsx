"use client";

import { Edit3 } from "lucide-react";

interface ProfileCardProps {
  name: string;
  username: string;
  attendance: number;
  percentage: number;
  workshops: number;
  avatarUrl?: string | null;
}

export default function ProfileCard({
  name,
  username,
  attendance,
  percentage,
  workshops,
  avatarUrl,
}: ProfileCardProps) {
  return (
    <div
      className="
        relative
        rounded-3xl
        p-6
        bg-gradient-to-br from-purple-100 via-purple-50 to-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* EDIT ICON */}
      <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 backdrop-blur flex items-center justify-center shadow">
        <Edit3 size={16} className="text-gray-600" />
      </button>

      {/* AVATAR */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full text-white flex items-center justify-center text-2xl font-semibold" style={{ backgroundColor: "#8B5CF6" }}>
            {name[0]}
          </div>
        )}
      </div>

      {/* NAME */}
      <h2 className="mt-4 text-2xl font-bold text-gray-900">
        {name}
      </h2>
      <p className="text-sm text-gray-500">{username}</p>

      {/* STATS */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <Stat label="Attendance" value={`${attendance}`} />
        <Stat label="Percentage" value={`${percentage}%`} />
        <Stat label="Workshops" value={workshops} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] tracking-wide text-gray-500 uppercase">
        {label}
      </p>
    </div>
  );
}
