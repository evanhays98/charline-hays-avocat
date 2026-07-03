"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Stagger = ({ children, className, delay = 0 }: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.09, delayChildren: delay } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
};
