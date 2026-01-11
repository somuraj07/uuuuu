"use client";

import { format } from "date-fns";
import { MAIN_COLOR } from "@/constants/colors";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { parentApi } from "@/services/parent/parent.api";
import { toast } from "@/services/toast/toast.service";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function HomeworkCard({ homework,reloadHomework }: { homework: any; reloadHomework: ()=>void }) {
  const {
    id,
    title,
    description,
    subject,
    dueDate,
    hasSubmitted,
  } = homework;

  const [hover, setHover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(hasSubmitted);

  const status = submitted ? "Submitted" : "Pending";

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await parentApi.homeworkSubmit({
        homeworkId: id,
        content: "Submitted from student portal",
      });
      toast.success("Homework submitted successfully");
      reloadHomework();
      setSubmitted(true);
    } catch (error) {
      console.error("Submit homework failed", error);
      toast.error("Failed to submit homework");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -6,
        boxShadow: "0 12px 30px rgba(16,185,129,0.18)",
      }}
      className="relative rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-100 p-5 shadow-sm border border-gray-100"
    >
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
          {subject || "General"}
        </span>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            submitted
              ? "text-green-700 bg-green-100"
              : "text-gray-600 bg-gray-100"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900">{title}</h3>

      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Calendar size={14} />
          {dueDate
            ? format(new Date(dueDate), "MMM dd • hh:mm a")
            : "No deadline"}
        </div>
      </div>

      <div className="mt-5">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="text-white text-sm px-5 py-2 rounded-full transition-colors duration-200 disabled:opacity-60"
            style={{
              backgroundColor: hover ? "#2e9e4f" : MAIN_COLOR,
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
