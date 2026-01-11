"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cardVariants, hoverPop } from "@/constants/parent/animations";
import { Clock } from "lucide-react";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getExpectedDate = (createdAt: string) => {
  const baseDate = new Date(createdAt);
  const randomDays = Math.floor(Math.random() * 3) + 5; 
  baseDate.setDate(baseDate.getDate() + randomDays);
  return formatDate(baseDate.toISOString());
};

export default function PendingRequests({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTcs = async () => {
    setLoading(true);
    const res = await fetch("/api/tc/list");
    const data = await res.json();
    setItems(data.tcs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTcs();
  }, [refreshKey]);

  const hoverPops = {
        whileHover: {
            scale: 1.04,
            y: -4,
        },
        transition: {
            type: "spring" as const,
            stiffness: 180,
            damping: 12,
        },
    };

  return (
    <motion.div
      variants={cardVariants}
      {...hoverPop}
      className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4"
    >
      <h2 className="font-semibold text-gray-800">Pending Requests</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No requests yet</p>
      ) : (
        items.map((item) => (
          <motion.div
            key={item.id}
            {...hoverPop}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-700">
                
              </p>

              {item.status === "PENDING" ? (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  <Clock size={12} className="inline mr-1" />
                  Processing
                </span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <Clock size={12} className="inline mr-1" />
                  Approved
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Requested: {formatDate(item.createdAt)}
            </p>

            {/* Expected */}
            {item.status === "PENDING" && (
              <p className="text-xs text-green-600">
                Expected: {getExpectedDate(item.createdAt)}
              </p>
            )}

            {/* Approved */}
            {item.approvedAt && (
              <p className="text-xs text-green-700 font-medium">
                Approved: {formatDate(item.approvedAt)}
              </p>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
