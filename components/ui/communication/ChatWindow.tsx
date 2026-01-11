"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

type ChatMessage = {
  id: string;
  appointmentId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function ChatWindow({ appointmentId }: { appointmentId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!appointmentId) return;

    setLoading(true);
    fetch(`/api/communication/messages?appointmentId=${appointmentId}`, {
      cache: "no-store",
    })
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (text: string) => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch("/api/communication/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, content: text.trim() }),
      });

      const savedMsg = await res.json();
      setMessages(prev => [...prev, savedMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-white shadow-sm border border-gray-200">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <SkeletonBubble align="left" />
            <SkeletonBubble align="right" />
            <SkeletonBubble align="left" />
          </div>
        )}

        {/* Messages */}
        {!loading && (
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <MessageBubble
                  message={msg}
                  isMine={msg.senderId === session?.user?.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={sending || loading} />
    </div>
  );
}

/* ---------------- Skeleton Bubble ---------------- */

function SkeletonBubble({ align }: { align: "left" | "right" }) {
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          h-10
          w-40
          rounded-2xl
          bg-gray-200
          ${align === "right" ? "rounded-br-md" : "rounded-bl-md"}
        `}
      />
    </div>
  );
}
