"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedCard({
  children,
  className,
}: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={clsx(
        `
        rounded-xl border border-gray-200 bg-white
        p-4 sm:p-5 md:p-6
        shadow-sm hover:shadow-md
        transition-shadow
        `,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
