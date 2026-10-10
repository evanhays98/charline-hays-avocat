import type { InputHTMLAttributes } from "react";

interface AdminFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const AdminField = ({ id, label, ...props }: AdminFieldProps) => (
  <div className="grid gap-1.5">
    <label
      htmlFor={id}
      className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
    >
      {label}
    </label>
    <input
      id={id}
      className="min-h-12 w-full border border-line bg-white px-3.5 text-[15px] text-ink transition-colors focus:border-navy focus:outline-none"
      {...props}
    />
  </div>
);
