"use client";

import { motion } from "framer-motion";
import { useStudentContext } from "@/context/StudentContext";

export default function StudentSwitcher() {
  const { students, activeStudent, setActiveStudentId } = useStudentContext();

  if (students.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 overflow-x-auto"
    >
      {students.map(s => (
        <button
          key={s.id}
          onClick={() => setActiveStudentId(s.id)}
          className={`px-4 py-2 rounded-full text-sm transition
            ${activeStudent?.id === s.id
              ? "bg-green-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {s.name}
        </button>
      ))}
    </motion.div>
  );
}
