import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  busy?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy text-paper hover:bg-navy-deep",
  secondary: "border border-line bg-paper text-navy hover:border-navy",
  danger:
    "border border-[#e7c2b8] bg-paper text-[#b4533c] hover:border-[#b4533c] hover:bg-[#fbefeb]",
  ghost: "text-ink-soft hover:bg-navy/5 hover:text-navy",
};

export const AdminButton = ({
  variant = "primary",
  busy = false,
  icon,
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}: AdminButtonProps) => (
  <button
    type={type}
    disabled={disabled || busy}
    aria-busy={busy}
    className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {busy ? (
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
    ) : (
      icon
    )}
    {children}
  </button>
);
