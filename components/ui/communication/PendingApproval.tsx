import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function PendingApproval() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-10 shadow-md text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
          <Clock className="text-yellow-600" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Waiting for Teacher Approval
      </h2>

      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Your chat request has been sent. Once the teacher approves, you can
        start messaging here.
      </p>
    </motion.div>
  );
}
