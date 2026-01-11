"use client";

import { MAIN_COLOR } from "@/constants/colors";
import { motion } from "framer-motion";

export default function MessageBubble({
  message,
  isMine,
}: {
  message: any;
  isMine: boolean;
}) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={isMine ? { backgroundColor: `${MAIN_COLOR}` } : { backgroundColor: "whitesmoke" }}
        className={`
          max-w-[75%] px-4 py-2 rounded-2xl text-sm
          ${isMine
            ? "text-white rounded-br-md"
            : "text-gray-800 rounded-bl-md"}
        `}
      >
        <p>{message.content}</p>
        <p className="text-[10px] opacity-60 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </motion.div>
    </div>
  );
}
