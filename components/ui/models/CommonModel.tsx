"use client";

import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string; 
}

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-lg",
}: CommonModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        className={`
          relative bg-white rounded-xl shadow-xl
          w-full ${width}
          p-6
          animate-scale-in
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-4">
          {children}
        </div>

        {footer && (
          <div className="mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
