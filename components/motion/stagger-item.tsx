"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/motion/transitions";

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className }: StaggerItemProps) => (
  <motion.div
    className={className ? `will-reveal ${className}` : "will-reveal"}
    variants={variants}
  >
    {children}
  </motion.div>
);
