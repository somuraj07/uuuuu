import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function ChatHeader() {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
          <MessageCircle className="text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Parent–Teacher Chat</h1>
          <p className="text-sm text-muted-foreground">
            Private, calm, and focused academic conversations.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
