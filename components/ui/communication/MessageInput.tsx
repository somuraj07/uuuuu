"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MAIN_COLOR } from "@/constants/colors";

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t px-4 py-3 bg-white rounded-b-3xl border-gray-200">
      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSend}
          disabled={disabled}
          style={{ backgroundColor: MAIN_COLOR }}
          className="text-white p-2 rounded-full shadow"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
