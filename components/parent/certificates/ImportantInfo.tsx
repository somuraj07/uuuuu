import { motion } from "framer-motion";
import { cardVariants } from "@/constants/parent/animations";

export default function ImportantInfo() {
    const hoverPops = {
        whileHover: {
            scale: 1.04,
            y: -4,
        },
        transition: {
            type: "spring" as const,
            stiffness: 180,
            damping: 12,
        },
    };

    return (
        <motion.div
            variants={cardVariants}
            {...hoverPops}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        >
            <h2 className="font-semibold text-gray-800 mb-3">
                Important Information
            </h2>

            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-600">
                <li>Issued in 5–7 business days.</li>
                <li>All certificates are digitally signed & verifiable.</li>
                <li>Physical copies available at college office.</li>
                <li>Contact administration for urgent issuance.</li>
            </ul>
        </motion.div>
    );
}
