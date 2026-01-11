"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion

type AppointmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

interface Appointment {
  id: string;
  studentId: string;
  teacherId: string;
  status: AppointmentStatus;
  note?: string | null;
  studentName?: string; 
  studentClass?: string;
}

interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function CommunicationPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"All" | "Approved" | "Pending">("All");

  const socketRef = useRef<any>(null);
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

  useEffect(() => {
    const socketInstance = io(socketUrl);
    socketRef.current = socketInstance;
    return () => { socketInstance.disconnect(); socketRef.current = null; };
  }, [socketUrl]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchAppointments = async () => {
      const res = await fetch("/api/communication/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    };
    fetchAppointments();
  }, [status, session]);

  useEffect(() => {
    if (!selected) return;
    const roomId = selected.id;
    socketRef.current?.emit("join-room", roomId);
    const handler = (message: ChatMessage) => { setMessages((prev) => [...prev, message]); };
    socketRef.current?.on("receive-message", handler);
    fetch(`/api/communication/messages?appointmentId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
    return () => { socketRef.current?.off("receive-message", handler); };
  }, [selected]);

  const sendMessage = async () => {
    if (!selected || !newMessage.trim() || selected.status !== "APPROVED") return;
    const res = await fetch("/api/communication/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: selected.id, content: newMessage.trim() }),
    });
    if (res.ok) {
      const msg: ChatMessage = await res.json();
      setNewMessage("");
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.emit("send-message", { roomId: selected.id, message: msg });
    }
  };

  const approveAppointment = async (appointmentId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/communication/appointments/${appointmentId}/approve`, { method: "POST" });
      if (res.ok) {
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status: "APPROVED" } : a)));
        if (selected?.id === appointmentId) { setSelected({ ...selected, status: "APPROVED" }); }
      }
    } finally { setSaving(false); }
  };

  const filteredList = appointments.filter((a) => {
    const matchesFilter = filter === "All" || (filter === "Approved" && a.status === "APPROVED") || (filter === "Pending" && a.status === "PENDING");
    return matchesFilter && (a.studentName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
  });

  if (status === "loading") return <div className="h-screen flex items-center justify-center bg-gray-50 text-[#4ade80] font-bold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Chat</h1>
          <p className="text-gray-500 text-sm">Communicate with students about progress</p>
        </div>
        <div className="bg-[#FBBF24] text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm">
          {appointments.filter(a => a.status === "PENDING").length} Pending Approvals
        </div>
      </motion.div>

      <div className="flex gap-6 h-[80vh]">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 space-y-4 border-b border-gray-50">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-bold">🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#4ade80] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "Approved", "Pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    filter === f ? "bg-[#4ade80] text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <AnimatePresence>
              {filteredList.map((appt) => (
                <motion.div 
                  key={appt.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <button
                    onClick={() => setSelected(appt)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      selected?.id === appt.id ? "bg-[#4ade80] text-white shadow-lg scale-[1.02]" : "hover:bg-gray-50 text-gray-700 hover:scale-[1.01]"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                      selected?.id === appt.id ? "bg-white text-[#4ade80]" : "bg-[#4ade80] text-white"
                    }`}>
                      {(appt.studentName || "U").charAt(0)}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className={`font-bold truncate ${selected?.id === appt.id ? "text-white" : "text-gray-900"}`}>
                        {appt.studentName || "Student"}
                      </p>
                      <p className={`text-xs truncate ${selected?.id === appt.id ? "text-white/80" : "text-gray-500"}`}>
                        {appt.studentClass || "Class Not Set"}
                      </p>
                    </div>
                    {appt.status === "PENDING" && selected?.id !== appt.id && (
                      <span className="bg-[#FBBF24] text-white text-[10px] px-2 py-0.5 rounded-md uppercase font-black">Pending</span>
                    )}
                  </button>
                  {session?.user?.role === "TEACHER" && appt.status === "PENDING" && (
                    <div className="flex gap-2 px-1 mt-2">
                      <button onClick={() => approveAppointment(appt.id)} disabled={saving} className="flex-1 bg-[#4ade80] text-white text-xs py-2 rounded-lg font-bold hover:bg-[#22c55e] transition-colors shadow-sm">✓ Approve</button>
                      <button className="flex-1 bg-[#EF4444] text-white text-xs py-2 rounded-lg font-bold hover:bg-rose-600 transition-colors shadow-sm">✕ Reject</button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Chat Window */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div 
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-white z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#4ade80] flex items-center justify-center text-white font-bold text-xl">
                      {(selected.studentName || "U").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{selected.studentName || "Student Name"}</h3>
                      <p className="text-xs text-gray-500 font-medium">{selected.studentClass || "Class Not Set"}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 text-xl font-bold">⋮</button>
                </div>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
                  {selected.status !== "APPROVED" && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-700 text-sm flex items-center gap-3">
                      <span>⚠️ Messaging will be enabled after approval.</span>
                    </motion.div>
                  )}
                  {messages.map((m, idx) => {
                    const isMe = m.senderId === session?.user?.id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={m.id} 
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          isMe ? "bg-[#4ade80] text-white rounded-tr-none" : "bg-[#F1F5F9] text-gray-800 rounded-tl-none border border-gray-100"
                        }`}>
                          <p>{m.content}</p>
                          <p className={`text-[10px] mt-1.5 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className={`flex items-center gap-2 bg-[#F8FAFC] rounded-2xl p-2 border ${selected.status === "APPROVED" ? "border-gray-200" : "opacity-50"}`}>
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      disabled={selected.status !== "APPROVED"}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      disabled={selected.status !== "APPROVED" || !newMessage.trim()}
                      className="bg-[#4ade80] text-white p-2.5 rounded-xl hover:bg-[#22c55e] shadow-md"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current rotate-90"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">💬</div>
                <p className="text-lg font-semibold text-gray-500">No Conversation Selected</p>
                <p className="text-sm">Select a student to start chatting.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}