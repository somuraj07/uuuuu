"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

interface Exam {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function ExamsPage() {
  const [name, setName] = useState("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exams/list");
      const data = await res.json();
      if (res.ok) {
        setExams(data.exams || []);
      } else {
        toast.error(data.message || "Failed to fetch exams");
      }
    } catch (error) {
      console.error("Fetch exams error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const createExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter exam name");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/exams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to create exam");
        return;
      }

      toast.success("Exam created successfully");
      setName("");
      fetchExams();
    } catch (error) {
      console.error("Create exam error:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: MAIN_COLOR }}>
          Manage Exams
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage exams (Unit 1, Mid Term, Final, etc.)
        </p>
      </div>

      {/* Create Exam Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: MAIN_COLOR }}>
          Add New Exam
        </h2>
        <form onSubmit={createExam} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exam name (e.g., Unit 1, Mid Term, Final)"
            className="flex-1 px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2"
            style={{ focusRingColor: MAIN_COLOR }}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-lg text-white font-medium transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: MAIN_COLOR }}
            onMouseEnter={(e) => !submitting && (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={18} />
            {submitting ? "Adding..." : "Add Exam"}
          </button>
        </form>
      </motion.div>

      {/* Exams List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: MAIN_COLOR }}>
          All Exams
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No exams yet. Create your first exam above.
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 rounded-xl glass border flex items-center justify-between hover:glass-strong transition"
                style={{ borderColor: ACCENT_COLOR }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: ACCENT_COLOR + "40" }}
                  >
                    <Calendar size={20} style={{ color: MAIN_COLOR }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{exam.name}</p>
                    <p className="text-xs text-gray-500">
                      Created on {formatDate(exam.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {exam.isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100" style={{ color: MAIN_COLOR }}>
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
