"use client";

import { motion } from "framer-motion";
import { cardVariants, hoverPop } from "@/constants/parent/animations";
import { MAIN_COLOR } from "@/constants/colors";
import { useState } from "react";
import { toast } from "@/services/toast/toast.service";

export default function RequestCertificateForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const [certificateType, setCertificateType] = useState("Bonafide Certificate");
    const [reason, setReason] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error("Please enter reason");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/tc/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Certificate request submitted");

            setCertificateType("Bonafide Certificate");
            setReason("");
            setEmail("");

            onSuccess?.();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            {...hoverPop}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        >
            <h2 className="font-semibold text-gray-800 mb-4">
                Request New Certificate
            </h2>

            <div className="space-y-4">
                <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Character Certificate">Character Certificate</option>
                    <option value="Transfer Certificate">Transfer Certificate</option>
                    <option value="Conduct Certificate">Conduct Certificate</option>
                    <option value="Attendance Certificate">Attendance Certificate</option>
                </select>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full text-white rounded-lg py-2 text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: MAIN_COLOR,
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1b6d39ff")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = MAIN_COLOR)
                    }
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>

                <p className="text-xs text-center text-gray-400">
                    Processing time: 5–7 business days
                </p>
            </div>
        </motion.div>
    );
}
