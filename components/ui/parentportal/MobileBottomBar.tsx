"use client";

import {
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiCreditCard,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function MobileBottomNav({
  onMore,
}: {
  onMore: () => void;
}) {
  const router = useRouter();
  const tab = useSearchParams().get("tab") ?? "dashboard";

  const Item = ({
    icon,
    label,
    active,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all",
        active
          ? "bg-green-100 text-green-600"
          : "text-gray-500"
      )}
    >
      <div className="text-lg">{icon}</div>
      <span className="text-[11px]">{label}</span>
    </button>
  );

  return (
    <div
      className="
        fixed md:hidden
        left-1/2 -translate-x-1/2
        bottom-4
        z-40
        w-[92%]
        rounded-2xl
        backdrop-blur-xl
        bg-white/70
        border border-white/40
        shadow-[0_20px_40px_rgba(0,0,0,0.12)]
        px-4 py-2
      "
    >
      <div className="flex justify-between items-center">
        <Item
          icon={<FiHome />}
          label="Home"
          active={tab === "dashboard"}
          onClick={() => router.push("/frontend/parent/dashboard")}
        />
        <Item
          icon={<FiBookOpen />}
          label="Homework"
          active={tab === "homework"}
          onClick={() => router.push("?tab=homework")}
        />
        <Item
          icon={<FiCalendar />}
          label="Attendance"
          active={tab === "attendance"}
          onClick={() => router.push("?tab=attendance")}
        />
        <Item
          icon={<FiCreditCard />}
          label="Fees"
          active={tab === "fees"}
          onClick={() => router.push("?tab=fees")}
        />
        <Item
          icon={<FiMoreHorizontal />}
          label="More"
          onClick={onMore}
        />
      </div>
    </div>
  );
}
