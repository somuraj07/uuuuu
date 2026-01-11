"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Exam {
  id: string;
  name: string;
}

export default function AdminExamsPage() {
  const [name, setName] = useState("");
  const [exams, setExams] = useState<Exam[]>([]);

  const fetchExams = async () => {
    const res = await fetch("/api/exams/list");
    const data = await res.json();
    if (res.ok) setExams(data.exams);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const createExam = async () => {
    if (!name.trim()) return;

    await fetch("/api/exams/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchExams();
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Exams</h1>

      <div className="flex gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Exam name (Unit Test, Mid Term...)"
          className="flex-1 p-3 rounded-xl border"
        />
        <button
          onClick={createExam}
          className="bg-[#33b663] text-white px-6 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <ul className="space-y-3">
        {exams.map((e) => (
          <li
            key={e.id}
            className="p-4 bg-white border rounded-xl flex justify-between"
          >
            <span className="font-semibold">{e.name}</span>
            <Trash2 className="text-red-400 cursor-pointer" size={18} />
          </li>
        ))}
      </ul>
    </div>
  );
}
