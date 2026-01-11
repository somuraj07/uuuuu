"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SelectField from "@/components/ui/common/SelectField";
import { MAIN_COLOR } from "@/constants/colors";

type Teacher = {
  id: string;
  name: string;
};

export default function RequestChatCard({
  onRequested,
  teachers = [],
  excludedTeacherIds = [],
  reloadAppointments,
}: {
  onRequested?: () => void;
  teachers: Teacher[];
  excludedTeacherIds?: string[];
    reloadAppointments: () => void;
}) {
  const [teacherId, setTeacherId] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);

  /* ---------------- FILTER TEACHERS ---------------- */
  useEffect(() => {
    const filtered = teachers.filter(
      (t) => !excludedTeacherIds.includes(t.id)
    );

    setAvailableTeachers(filtered);
  }, [teachers, excludedTeacherIds]);

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!teacherId || !topic.trim()) return;

    setLoading(true);

    await fetch("/api/communication/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId,
        note: topic,
      }),
    });

    setLoading(false);
    reloadAppointments();
    onRequested?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Start New Chat</h3>

      <SelectField
        label="Teacher"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        options={availableTeachers}  
        placeholder={
          availableTeachers.length === 0
            ? "All teachers already contacted"
            : "Select teacher"
        }
        disabled={availableTeachers.length === 0}
      />

      <div>
        <label className="text-sm font-medium">Topic</label>
        <textarea
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full mt-1 rounded-xl border px-4 py-3 text-sm resize-none border-gray-200"
          placeholder="Homework, exams, guidance..."
        />
      </div>

      <button
        onClick={submit}
        disabled={loading || !teacherId}
        style={{ backgroundColor: MAIN_COLOR }}
        className="w-full hover:bg-green-600 text-white py-2 rounded-xl font-semibold disabled:opacity-50"
      >
        {loading ? "Requesting..." : "Request Chat"}
      </button>
    </motion.div>
  );
}
