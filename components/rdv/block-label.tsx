import type { ReactNode } from "react";
import { RequiredDot } from "@/components/rdv/required-dot";

interface BlockLabelProps {
  id: string;
  children: ReactNode;
  required?: { done: boolean };
}

export const BlockLabel = ({ id, children, required }: BlockLabelProps) => (
  <p
    id={id}
    className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-mist"
  >
    {required ? <RequiredDot done={required.done} /> : null}
    {children}
    {required ? null : (
      <span className="font-medium tracking-[0.04em] normal-case text-mist/70">
        · facultatif
      </span>
    )}
  </p>
);
