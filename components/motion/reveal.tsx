"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/components/motion/transitions";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Reveal = ({ children, className, delay = 0 }: RevealProps) => (
  <motion.div
    className={className ? `will-reveal ${className}` : "will-reveal"}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    transition={{ duration: 0.6, ease: EASE_OUT, delay }}
  >
    {children}
  </motion.div>
);
