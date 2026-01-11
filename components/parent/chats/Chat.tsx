"use client";

import { useState, useMemo } from "react";
import ChatHeader from "@/components/ui/communication/Header";
import ChatWindow from "@/components/ui/communication/ChatWindow";
import PendingApproval from "@/components/ui/communication/PendingApproval";
import RequestChatCard from "@/components/ui/communication/RequestChatCard";
import { Appointment } from "@/interfaces/chats";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MAIN_COLOR } from "@/constants/colors";

export default function ParentChatShell({
  appointments,
  teachers,
  reloadAppointments
}: {
  appointments: Appointment[];
  teachers: any[];
  reloadAppointments: () => void;
}) {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [search, setSearch] = useState("");

  const existingTeacherIds = appointments.map(a => a.teacherId);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt =>
      (appt.teacher?.name ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [appointments, search]);

  const closeChat = () => setSelected(null);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <ChatHeader />

      <div className="relative h-[75vh]">
        {/* ================= CONVERSATIONS ================= */}
        <div
          className={`
            absolute inset-0
            md:static md:flex
            ${selected ? "hidden md:flex" : "flex"}
          `}
        >
          <div className="md:w-1/3 w-full bg-white rounded-3xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header + Search */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="font-semibold">Conversations</div>

              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teacher..."
                  className="
                    w-full rounded-xl border border-gray-200
                    px-4 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-200
                  "
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2 text-gray-400 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2">
              <AnimatePresence>
                {filteredAppointments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-gray-400 mt-10"
                  >
                    No conversations found
                  </motion.div>
                ) : (
                  filteredAppointments.map((appt, index) => {
                    const isSelected = selected?.id === appt.id;

                    return (
                      <motion.button
                        key={appt.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelected(appt)}
                        className={`
                          w-full text-left rounded-2xl p-4 mb-2 border transition
                          ${
                            isSelected
                              ? "bg-green-50 border-green-200 shadow"
                              : "bg-white border-gray-200 hover:shadow-sm"
                          }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">
                            {appt.teacher?.name ?? "Teacher"}
                          </div>

                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-medium
                              ${
                                appt.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }
                            `}
                          >
                            {appt.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Parent–Teacher conversation
                        </p>
                      </motion.button>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={() => setShowRequest(true)}
                style={{ backgroundColor: MAIN_COLOR }}
                className="w-full hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
              >
                + New Chat
              </button>
            </div>
          </div>
        </div>

        {/* ================= CHAT VIEW ================= */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              className="
                absolute inset-0
                md:static md:flex
                md:w-2/3 w-full
                bg-white rounded-3xl border border-gray-200
                flex flex-col
              "
            >
              {/* Mobile Back */}
              <div className="md:hidden flex items-center gap-2 p-4">
                <button onClick={closeChat}>
                  <ArrowLeft size={18} />
                </button>
                <span className="font-semibold">
                  {selected.teacher?.name ?? "Teacher"}
                </span>
              </div>

              {selected.status === "PENDING" && <PendingApproval />}
              {selected.status === "APPROVED" && (
                <ChatWindow appointmentId={selected.id} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= REQUEST CHAT MODAL ================= */}
      <AnimatePresence>
        {showRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md p-6"
            >
              <RequestChatCard
                teachers={teachers}
                reloadAppointments={reloadAppointments}
                excludedTeacherIds={existingTeacherIds}
                onRequested={() => {
                  setShowRequest(false);
                  setSelected(null);
                }}
              />

              <button
                onClick={() => setShowRequest(false)}
                className="mt-4 w-full text-sm text-gray-500"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
