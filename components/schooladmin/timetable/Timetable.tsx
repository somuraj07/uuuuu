"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Calendar, Clock } from "lucide-react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR, MAIN_COLOR_LIGHT, ACCENT_COLOR } from "@/constants/colors";
import SelectField from "@/components/ui/common/SelectField";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

interface TimetableEntry {
  id: string;
  classId: string;
  dayOfWeek: number;
  period: number;
  subject: string;
  teacherId: string | null;
  startTime: string | null;
  endTime: string | null;
  class?: { id: string; name: string; section: string | null };
  teacher?: { id: string; name: string | null; email: string | null } | null;
}

export default function TimetablePage({
  classes,
  teachers,
  reload,
}: {
  classes: any[];
  teachers: any[];
  reload: () => void;
}) {
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    period: 1,
    subject: "",
    teacherId: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    } else {
      setTimetable([]);
    }
  }, [selectedClass]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/timetable/list?classId=${selectedClass}`);
      const data = await res.json();
      if (res.ok) {
        setTimetable(data.timetables || []);
      } else {
        toast.error(data.message || "Failed to fetch timetable");
      }
    } catch (error) {
      console.error("Fetch timetable error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }

    try {
      const url = editingEntry
        ? `/api/timetable/${editingEntry.id}`
        : "/api/timetable/create";
      const method = editingEntry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          ...formData,
          teacherId: formData.teacherId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save timetable entry");
        return;
      }

      toast.success(editingEntry ? "Timetable updated" : "Timetable entry added");
      setShowModal(false);
      setEditingEntry(null);
      resetForm();
      fetchTimetable();
      reload();
    } catch (error) {
      console.error("Save timetable error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      dayOfWeek: entry.dayOfWeek,
      period: entry.period,
      subject: entry.subject,
      teacherId: entry.teacherId || "",
      startTime: entry.startTime || "",
      endTime: entry.endTime || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) return;

    try {
      const res = await fetch(`/api/timetable/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete timetable entry");
        return;
      }

      toast.success("Timetable entry deleted");
      fetchTimetable();
      reload();
    } catch (error) {
      console.error("Delete timetable error:", error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: 1,
      period: 1,
      subject: "",
      teacherId: "",
      startTime: "",
      endTime: "",
    });
  };

  const getTimetableEntry = (day: number, period: number) => {
    return timetable.find((t) => t.dayOfWeek === day && t.period === period);
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClass);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: MAIN_COLOR }}>
          Timetable Management
        </h1>
        <p className="text-sm text-gray-500">
          Create and manage class timetables
        </p>
      </div>

      {/* Class Selector */}
      <div className="glass-card rounded-2xl p-6">
        <SelectField
          label="Select Class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={classes.map((c) => ({
            name: `${c.name}${c.section ? ` - ${c.section}` : ""}`,
            id: c.id,
          }))}
        />
      </div>

      {/* Timetable Grid */}
      {selectedClass && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: MAIN_COLOR }}>
              {selectedClassObj?.name}
              {selectedClassObj?.section ? ` - ${selectedClassObj.section}` : ""}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setEditingEntry(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition"
              style={{ backgroundColor: MAIN_COLOR }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={18} />
              Add Entry
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Period</th>
                    {DAYS.map((day) => (
                      <th
                        key={day.value}
                        className="text-center py-3 px-2 font-semibold text-gray-700 min-w-[120px]"
                      >
                        {day.label.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period) => (
                    <tr key={period} className="border-b last:border-none">
                      <td className="py-3 px-2 font-medium text-gray-700 text-center">
                        {period}
                      </td>
                      {DAYS.map((day) => {
                        const entry = getTimetableEntry(day.value, period);
                        return (
                          <td
                            key={day.value}
                            className="py-3 px-2 text-center"
                          >
                            {entry ? (
                              <div className="glass rounded-lg p-2 border group relative" style={{ borderColor: ACCENT_COLOR }}>
                                <div className="font-medium text-gray-800 text-xs">
                                  {entry.subject}
                                </div>
                                {entry.teacher && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {entry.teacher.name}
                                  </div>
                                )}
                                {(entry.startTime || entry.endTime) && (
                                  <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                    <Clock size={10} />
                                    {entry.startTime && entry.endTime
                                      ? `${entry.startTime}-${entry.endTime}`
                                      : entry.startTime || entry.endTime}
                                  </div>
                                )}
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                  <button
                                    onClick={() => handleEdit(entry)}
                                    className="p-1 rounded bg-white shadow"
                                    style={{ color: MAIN_COLOR }}
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="p-1 rounded bg-white shadow text-red-500"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    dayOfWeek: day.value,
                                    period: period,
                                  });
                                  setEditingEntry(null);
                                  setShowModal(true);
                                }}
                                className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs border border-dashed border-gray-300 rounded hover:border-purple-300 transition"
                              >
                                Add
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: MAIN_COLOR }}>
              {editingEntry ? "Edit Timetable Entry" : "Add Timetable Entry"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: Number(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 py-2 glass"
                  required
                >
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: Number(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 py-2 glass"
                  required
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      Period {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 glass"
                  required
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher (Optional)
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 glass"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 glass"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 glass"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEntry(null);
                    resetForm();
                  }}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition"
                  style={{ backgroundColor: MAIN_COLOR }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {editingEntry ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
