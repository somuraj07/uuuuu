"use client";

import { useState, useCallback } from "react";
import InputField from "@/components/ui/common/InputField";
import SelectField from "@/components/ui/common/SelectField";
import { MAIN_COLOR } from "@/constants/colors";
import { motion, type Variants } from "framer-motion";
import { useToastContext } from "@/services/toast/ToastContext";
import { FiLayers } from "react-icons/fi";

interface Teacher {
  id: string;
  name: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

interface Props {
  teachers: Teacher[];
  loadingTeachers: boolean;
  reload: () => void;
}

export default function CreateClassForm({ teachers, loadingTeachers, reload }: Props) {
  const { show } = useToastContext();

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    className?: string;
    section?: string;
    teacherId?: string;
  }>({});

  /* ---------------- Validation ---------------- */

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!className.trim()) errors.className = "Class name is required";
    if (!section.trim()) errors.section = "Section is required";
    if (!teacherId) errors.teacherId = "Class teacher is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setSubmitting(true);

      try {
        const res = await fetch("/api/class/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: className.trim(),
            section: section.trim(),
            teacherId,
          }),
        });

        const data = await res.json();
        reload();
        if (!res.ok) {
          show(data.message || "Failed to create class", "error");
          return;
        }

        show("Class created successfully", "success");

        setClassName("");
        setSection("");
        setTeacherId("");
        setFieldErrors({});
      } catch {
        show("Something went wrong. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [className, section, teacherId]
  );

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl p-4 sm:p-6 space-y-6 shadow-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">
                  <FiLayers />
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Class Information</h2>
                <p className="text-sm text-gray-500">
                  Enter the details for the new class
                </p>
              </div>
            </div>
          </motion.div>

          <div className="border-t border-gray-200" />

          {/* Class Name */}
          <motion.div variants={itemVariants} className="w-full">
            <InputField
              label="Class Name *"
              placeholder="e.g., Class 10"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                setFieldErrors((p) => ({ ...p, className: undefined }));
              }}
            />
            {fieldErrors.className && (
              <p className="text-sm text-red-600 mt-1">
                {fieldErrors.className}
              </p>
            )}
          </motion.div>

          {/* Section */}
          <motion.div variants={itemVariants} className="w-full">
            <InputField
              label="Section *"
              placeholder="e.g., A, B, C"
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setFieldErrors((p) => ({ ...p, section: undefined }));
              }}
            />
            {fieldErrors.section && (
              <p className="text-sm text-red-600 mt-1">
                {fieldErrors.section}
              </p>
            )}
          </motion.div>

          {/* Teacher (Responsive Select) */}
          <motion.div variants={itemVariants} className="w-full">
            <SelectField
              label="Assign Class Teacher *"
              value={teacherId}
              disabled={loadingTeachers}
              placeholder={
                loadingTeachers ? "Loading teachers..." : "Select a teacher"
              }
              onChange={(e) => {
                setTeacherId(e.target.value);
                setFieldErrors((p) => ({ ...p, teacherId: undefined }));
              }}
              options={teachers.map((t) => ({
                id: t.id,
                name: t.name,
              }))}
            />
            {fieldErrors.teacherId && (
              <p className="text-sm text-red-600 mt-1">
                {fieldErrors.teacherId}
              </p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants} className="w-full">
            <button
              type="submit"
              disabled={submitting || loadingTeachers}
              style={{ backgroundColor: MAIN_COLOR }}
              className="w-full py-3 rounded-xl text-white font-medium disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Class"}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
