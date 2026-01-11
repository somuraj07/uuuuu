"use client";

import {
  FiMessageCircle,
  FiAward,
  FiFileText,
  FiBarChart2,
  FiX,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function MobileRadialMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();

  const Item = ({
    icon,
    label,
    tab,
  }: {
    icon: React.ReactNode;
    label: string;
    tab: string;
  }) => (
    <button
      onClick={() => {
        router.push(`?tab=${tab}`);
        onClose();
      }}
      className="flex flex-col items-center gap-1"
    >
      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center pb-28">
      <div className="relative grid grid-cols-3 gap-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl">
        <Item icon={<FiMessageCircle />} label="Chat" tab="chat" />
        <Item icon={<FiBarChart2 />} label="Marks" tab="marks" />
        <Item icon={<FiAward />} label="Workshops" tab="workshops" />
        <Item icon={<FiFileText />} label="Certificates" tab="certificates" />

        <button
          onClick={onClose}
          className="absolute -top-4 right-4 bg-white rounded-full p-2 shadow"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}
