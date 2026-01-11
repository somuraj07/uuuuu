"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cardVariants, hoverPop } from "@/constants/parent/animations";

export default function StatsCards() {
  const [processingCount, setProcessingCount] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tc/list");
      const data = await res.json();

      const tcs = data.tcs || [];

      const processing = tcs.filter(
        (tc: any) => tc.status === "PENDING"
      ).length;

      const issued = tcs.filter(
        (tc: any) => tc.status === "APPROVED"
      ).length;

      setProcessingCount(processing);
      setIssuedCount(issued);
    } catch (error) {
      console.error("Failed to fetch TC stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    {
      label: "Processing",
      value: processingCount,
      color: "text-yellow-600",
    },
    {
      label: "Total Issued",
      value: issuedCount,
      color: "text-green-600",
    },
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {cards.map((item) => (
        <motion.div
          key={item.label}
          {...hoverPop}
          className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 via-white to-green-50 p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        >
          <p className={`text-2xl font-semibold ${item.color}`}>
            {loading ? "—" : item.value}
          </p>
          <p className="text-sm text-gray-500 mt-1">{item.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
