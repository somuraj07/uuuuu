"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2, Trash2, Search, Plus,
  X, ChevronDown, Save, User
} from "lucide-react";

/* ================= TYPES ================= */

interface Class {
  id: string;
  name: string;
  section: string | null;
}

interface Student {
  id: string;
  user: { name: string | null };
}

interface Mark {
  id: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string | null;
  suggestions: string | null;
  createdAt: string;
  exam?: { id: string; name: string };
  class: { id: string; name: string; section: string | null };
  teacher?: { name: string | null; subject?: string };
  student?: { id: string; user: { name: string | null } };
}

export default function MarksPage() {
  const { data: session, status } = useSession();

  // State
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<{ id: string; name: string }[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [examFilter, setExamFilter] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    marks: "",
    totalMarks: "100",
    suggestions: "",
  });

  const [selectedStudent, setSelectedStudent] = useState("");

  // Teacher Subject Logic
  const teacherSubject = (session?.user as any)?.subjectsTaught;

  /* ================= FETCHING ================= */

  useEffect(() => {
    if (session) {
      fetchMarks();
      if (session.user.role === "TEACHER") fetchClasses();
    }
  }, [session]);
  useEffect(() => {
    fetch("/api/exams/list")
      .then(res => res.json())
      .then(data => setExams(data.exams || []));
  }, []);

  useEffect(() => {
    if (selectedClass) fetchStudents();
  }, [selectedClass]);

  const fetchClasses = async () => {
    const res = await fetch("/api/class/list");
    const data = await res.json();
    if (res.ok) {
      setClasses(data.classes || []);
      if (data.classes?.length > 0) setSelectedClass(data.classes[0].id);
    }
  };

  const fetchStudents = async () => {
    const res = await fetch(`/api/class/students?classId=${selectedClass}`);
    const data = await res.json();
    if (res.ok) setStudents(data.students || []);
  };

  const fetchMarks = async () => {
    setLoading(true);
    const res = await fetch("/api/marks/view");
    const data = await res.json();
    if (res.ok) setMarks(data.marks || []);
    setLoading(false);
  };

  /* ================= HANDLERS ================= */

  const filteredMarks = useMemo(() => {
    return marks.filter((m) => {
      const matchesSearch =
        m.student?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExam =
        !examFilter || m.exam?.id === examFilter;

      return matchesSearch && matchesExam;
    });
  }, [marks, searchQuery, examFilter]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      classId: selectedClass,
      studentId: selectedStudent,
      subject: teacherSubject,
      examId: selectedExam,
      marks: Number(form.marks),
      totalMarks: Number(form.totalMarks),
      suggestions: form.suggestions || null,
    };


    const url = editingMarkId ? `/api/marks/${editingMarkId}` : "/api/marks/create";
    const method = editingMarkId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchMarks();
      setShowAdd(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setForm({ studentId: "", subject: "", marks: "", totalMarks: "100", suggestions: "" });
    setEditingMarkId(null);
    setSelectedStudent("");
  };

  const getGradeStyle = (grade: string | null) => {
    switch (grade) {
      case 'A+': return 'bg-[#33b663] text-white';
      case 'A': return 'bg-[#33b663] text-white';
      case 'B': return 'bg-green-200 text-white';
      case 'C': return 'bg-yellow-400 text-white';
      case 'D': return 'bg-red-400 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  function handleEdit(m: Mark): void {
    throw new Error("Function not implemented.");
  }

  function handleDelete(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] p-6 md:p-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Marks</h1>
        <p className="text-gray-500 mt-1">View and manage student performance</p>
      </div>

      {/* SELECTION BAR */}
      <div className="max-w-7xl mx-auto bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Select Class to View Marks
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none appearance-none focus:ring-2 focus:ring-[#33b663]/20"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {session?.user.role === "TEACHER" && (
          <button
            onClick={() => { resetForm(); setShowAdd(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#33b663] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95"
          >
            <Plus size={18} /> Add Marks
          </button>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-lg text-gray-800">
            Marks for {classes.find(c => c.id === selectedClass)?.name || "All Classes"}
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#33b663]/20"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              <option value="">All Exams</option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">exam</th>
                <th className="px-6 py-4 text-center">Marks</th>
                <th className="px-6 py-4 text-center">Total</th>
                <th className="px-6 py-4 text-center">Grade</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMarks.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-gray-500 font-medium">#{m.student?.id.slice(-4)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{m.student?.user?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{m.subject}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {m.exam?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-center font-bold text-[#33b663]">{m.marks}</td>
                  <td className="px-6 py-4 text-center text-gray-400">{m.totalMarks}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-[10px] font-black ${getGradeStyle(m.grade)}`}>
                      {m.grade || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2 transition-opacity opacity-100">
                      <button onClick={() => handleEdit(m)} className="p-2 bg-white text-[#33b663] hover:text-white hover:bg-[#33b663] rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md overflow-hidden relative"
            >
              <button onClick={() => setShowAdd(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-gray-900 mb-8">
                {editingMarkId ? 'Update Marks' : `Add ${teacherSubject} Marks`}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!editingMarkId && (
                  <div className="space-y-4">
                    <select
                      required
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#33b663]"
                    >
                      <option value="">Select Student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.user.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Subject</label>
                    <input
                      disabled
                      value={editingMarkId ? form.subject : teacherSubject}
                      className="w-full p-4 rounded-2xl bg-gray-100 border-none text-gray-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Total Marks</label>
                    <select
                      value={form.totalMarks}
                      onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
                    >
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Exam
                  </label>
                  <select
                    required
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <option value="">Select Exam</option>
                    {exams.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Obtained Marks</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter marks"
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#33b663] text-lg font-bold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-[#33b663] text-white font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                  >
                    Save Marks
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
