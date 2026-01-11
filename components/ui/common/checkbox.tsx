"use client";

import { ReactNode } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  className?: string;
  isWhiteBorder?: boolean;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className = "",
  isWhiteBorder = true,
}: CheckboxProps) {
  const borderColor = isWhiteBorder ? "border-white" : "border-gray-800";
  const tickColor = isWhiteBorder ? "text-white" : "text-gray-800";
  const labelColor = isWhiteBorder ? "text-gray-300" : "text-gray-700";

  return (
    <label className="relative flex items-center gap-2 cursor-pointer select-none">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`
          peer
          w-4 h-4
          appearance-none
          bg-transparent
          border ${borderColor}
          rounded
          cursor-pointer
          transition
          focus:outline-none
          ${className}
        `}
      />

      {/* Checkmark */}
      <svg
        className={`
          absolute
          left-0
          top-0
          w-4 h-4
          p-[2px]
          ${tickColor}
          hidden
          peer-checked:block
          pointer-events-none
        `}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="2.3 1 20 20"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>

      {/* Label */}
      {label && (
        <span className={`text-sm ml-1 ${labelColor}`}>
          {label}
        </span>
      )}
    </label>
  );
}
