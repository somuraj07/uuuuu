import { Check, X, Loader2 } from "lucide-react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR } from "@/constants/colors";
import { useState } from "react";

export default function LeaveActionButtons({
  id,
  onSuccess,
  isTCApprovalsPage = false,
}: {
  id: string;
  onSuccess: () => void;
  isTCApprovalsPage?: boolean;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const action = async (type: "approve" | "reject") => {
    try {
      setLoading(type);

      const url =
        type === "approve"
          ? isTCApprovalsPage
            ? `/api/tc/${id}/approve`
            : `/api/leaves/${id}/approve`
          : isTCApprovalsPage
            ? `/api/tc/${id}/reject`
            : `/api/leaves/${id}/reject`;

      const res = await fetch(url, {
        method: isTCApprovalsPage ? "POST" : "PATCH",
        headers: isTCApprovalsPage
          ? { "Content-Type": "application/json" }
          : undefined,
        body: isTCApprovalsPage
          ? JSON.stringify({ tcDocumentUrl: null })
          : undefined,
      });


      if (!res.ok) throw new Error("Action failed");

      isTCApprovalsPage ? toast.success(`TC ${type}d`) : toast.success(`Leave ${type}d`);
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const isDisabled = loading !== null;

  return (
    <div className="flex gap-2">
      {/* APPROVE */}
      <button
        onClick={() => action("approve")}
        disabled={isDisabled}
        style={{ backgroundColor: MAIN_COLOR }}
        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-white
          ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
        `}
      >
        {loading === "approve" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        Approve
      </button>

      {/* REJECT */}
      <button
        onClick={() => action("reject")}
        disabled={isDisabled}
        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm
          border border-red-500 text-red-500
          ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-red-50"}
        `}
      >
        {loading === "reject" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <X size={14} />
        )}
        Reject
      </button>
    </div>
  );
}
