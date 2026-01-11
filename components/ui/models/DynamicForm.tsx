"use client";

import { useState } from "react";
import { FormField } from "@/interfaces/dashboard";
import { MAIN_COLOR } from "@/constants/colors";

interface DynamicFormProps {
  fields: FormField[];
  submitLabel: string;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  initialValues?: Record<string, any>;
  onSuccess?: () => void;
}

export default function DynamicForm({
  fields,
  submitLabel,
  onSubmit,
  initialValues = {},
  onSuccess,
}: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(values);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>

          {["text", "email", "password", "number", "date"].includes(
            field.type
          ) && (
              <input
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            )}

          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          {field.type === "select" && (
            <select
              required={field.required}
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">
                {field.placeholder || "Select an option"}
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {field.type === "file" && (
            <div className="flex items-center gap-3">
              <input
                id={field.name}
                type="file"
                accept="image/*"
                required={field.required}
                onChange={(e) =>
                  handleChange(field.name, e.target.files?.[0] || null)
                }
                className="hidden"
              />

              <label
                htmlFor={field.name}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 transition"
              >
                📷 Upload Image
              </label>

              {values[field.name] && (
                <span className="text-xs text-gray-500 truncate max-w-[160px]">
                  {(values[field.name] as File).name}
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        style={submitting ? {} : { backgroundColor: MAIN_COLOR }}
        className={`w-full py-2 rounded-md text-white transition ${submitting
          ? "bg-gray-400 cursor-not-allowed"
          : "hover:brightness-90"
          }`}
      >
        {submitting ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}
