import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const cardVariants: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const hoverPop = {
  whileHover: { scale: 1.04 },
  transition: {
    type: "spring" as const,
    stiffness: 260,
    damping: 18,
  },
};

