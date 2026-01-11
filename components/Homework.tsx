"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, X, Calendar, Users, 
  BookOpen, User, ClipboardCheck, ArrowRight 
} from "lucide-react";

// --- Types ---
interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string | null;
  createdAt: string;
  class: { id: string; name: string; section: string | null };
  teacher: { id: string; name: string | null; email: string | null };
  _count: { submissions: number };
}

interface Class {
  id: string;
  name: string;
  section: string | null;
}

export default function HomeworkPage() {
  const { data: session, status } = useSession();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    classId: "",
    dueDate: "",
  });
  const [message, setMessage] = useState("");

  const teacherSubject = (session?.user as any)?.subjectsTaught || "General";

  useEffect(() => {
    if (session) {
      fetchHomeworks();
      fetchClasses();
    }
  }, [session]);

  const fetchHomeworks = async () => {
    try {
      const res = await fetch("/api/homework/list");
      const data = await res.json();
      if (res.ok && data.homeworks) setHomeworks(data.homeworks);
    } catch (err) { console.error(err); }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/class/list");
      const data = await res.json();
      if (res.ok && data.classes) setClasses(data.classes);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/homework/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: teacherSubject, dueDate: form.dueDate || null }),
      });
      if (res.ok) {
        setMessage("Success! Assignment live.");
        setForm({ title: "", description: "", subject: "", classId: "", dueDate: "" });
        setShowForm(false);
        fetchHomeworks();
      }
    } finally { setLoading(false); }
  };

  const filteredHomeworks = useMemo(() => {
    return homeworks.filter(h => 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [homeworks, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F8FAFB] min-h-screen font-sans">
      {/* HEADER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Homework Management</h1>
          <p className="text-gray-500 text-sm font-medium">Session Subject: <span className="text-[#4ade80] font-bold">{teacherSubject}</span></p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(!showForm); setMessage(""); }}
          className="bg-[#4ade80] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-100 flex items-center gap-2 transition-colors hover:bg-[#22c55e]"
        >
          {showForm ? <X size={20}/> : <Plus size={20}/>}
          {showForm ? "Cancel" : "New Assignment"}
        </motion.button>
      </motion.div>

      <div className="flex gap-8 h-[78vh]">
        {/* SIDEBAR */}
        <div className="w-2/5 flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#4ade80] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#4ade80]/20 transition-all"
            />
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 overflow-y-auto custom-scrollbar flex-1">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Active Board</h2>
            <div className="space-y-4">
              {filteredHomeworks.map((h, idx) => (
                <motion.button
                  key={h.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => { setSelectedHomework(h); setShowForm(false); }}
                  className={`w-full text-left p-5 rounded-[24px] transition-all border-2 ${
                    selectedHomework?.id === h.id 
                    ? "bg-[#4ade80] border-[#4ade80] text-white shadow-xl shadow-green-100" 
                    : "bg-white border-gray-50 hover:border-[#4ade80]/30 text-gray-700 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                      selectedHomework?.id === h.id ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {h.subject}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80">
                      <Users size={12} /> {h._count.submissions} Submissions
                    </div>
                  </div>
                  <h3 className="font-black text-lg mb-4 leading-tight">{h.title}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-2 p-2 rounded-xl ${selectedHomework?.id === h.id ? "bg-white/10" : "bg-gray-50"}`}>
                      <BookOpen size={14} className={selectedHomework?.id === h.id ? "text-white" : "text-[#4ade80]"} />
                      <span className="text-[10px] font-bold truncate">{h.class.name}</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-xl ${selectedHomework?.id === h.id ? "bg-white/10" : "bg-gray-50"}`}>
                      <Calendar size={14} className={selectedHomework?.id === h.id ? "text-white" : "text-[#4ade80]"} />
                      <span className="text-[10px] font-bold truncate">
                        {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : 'No Date'}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN DISPLAY AREA */}
        <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-10 overflow-y-auto"
              >
                <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                  <ClipboardCheck className="text-[#4ade80]" size={28} />
                  New {teacherSubject} Assignment
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase ml-1">Title *</label>
                      <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-[#4ade80]/10" placeholder="e.g. Weekly Quiz" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase ml-1">Target Class *</label>
                      <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-[#4ade80]/10">
                        <option value="">Select Class</option>
                        {classes.map((c) => (<option key={c.id} value={c.id}>{c.name} {c.section || ""}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Instructions *</label>
                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="w-full bg-gray-50 border-none rounded-3xl px-5 py-4 text-sm focus:ring-4 focus:ring-[#4ade80]/10 resize-none" placeholder="Provide clear steps for the students..." />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase ml-1">Due Date</label>
                      <input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-[#4ade80]/10" />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" disabled={loading} className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2">
                        {loading ? "Syncing..." : "Publish to Board"} <ArrowRight size={20}/>
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : selectedHomework ? (
              <motion.div 
                key={selectedHomework.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-10 border-b border-gray-50 bg-[#FCFDFD]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#4ade80] font-black text-xs uppercase tracking-[0.2em]">{selectedHomework.subject}</span>
                      <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6 leading-tight">{selectedHomework.title}</h2>
                    </div>
                    <div className="bg-[#4ade80] text-white px-5 py-3 rounded-2xl flex flex-col items-center shadow-lg shadow-green-100">
                       <span className="text-2xl font-black">{selectedHomework._count.submissions}</span>
                       <span className="text-[10px] font-bold uppercase opacity-80 tracking-tighter">Submissions</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 text-gray-400 mb-1">
                        <BookOpen size={14}/> <span className="text-[10px] font-black uppercase">Class</span>
                      </div>
                      <p className="font-black text-gray-800">{selectedHomework.class.name} <span className="text-[#4ade80]">{selectedHomework.class.section}</span></p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 text-gray-400 mb-1">
                        <Calendar size={14}/> <span className="text-[10px] font-black uppercase">Due Date</span>
                      </div>
                      <p className="font-black text-gray-800">{selectedHomework.dueDate ? new Date(selectedHomework.dueDate).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 text-gray-400 mb-1">
                        <User size={14}/> <span className="text-[10px] font-black uppercase">Teacher</span>
                      </div>
                      <p className="font-black text-gray-800 truncate">{selectedHomework.teacher.name || 'Admin'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 flex-1 overflow-y-auto bg-white">
                  <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">Detailed Instructions</h4>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-gray-600 leading-[1.8] text-lg bg-[#F8FAFB] p-8 rounded-[32px] whitespace-pre-wrap border border-gray-50 italic font-medium shadow-inner"
                  >
                    "{selectedHomework.description}"
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-gray-50 p-8 rounded-full"
                >
                  <ClipboardCheck size={64} className="opacity-20" />
                </motion.div>
                <p className="font-black text-gray-400 tracking-tight">Ready to Review Assignments</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}