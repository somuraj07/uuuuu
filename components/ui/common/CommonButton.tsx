"use client";

import { ReactNode } from "react";
import { MAIN_COLOR } from "@/constants/colors";

interface CommonButtonProps {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export default function CommonButton({
  label,
  onClick,
  icon,
}: CommonButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: MAIN_COLOR }}
      className="
        flex items-center gap-2
        px-4 py-2
        text-sm font-medium text-white
        rounded-lg
        hover:opacity-90
        transition
      "
    >
      {icon}
      {label}
    </button>
  );
}
