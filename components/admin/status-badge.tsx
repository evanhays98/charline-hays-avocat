import type { BookingStatus } from "@/lib/admin-api";

const STATUS: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: "À planifier",
    className: "border-gold/40 bg-gold/10 text-[#8a6c22]",
  },
  confirmed: {
    label: "Confirmé",
    className: "border-[#3f8f6a]/30 bg-[#3f8f6a]/10 text-[#2f6f51]",
  },
  declined: {
    label: "Refusé",
    className: "border-line bg-[#f1efe8] text-ink-soft",
  },
  cancelled: {
    label: "Annulé",
    className: "border-line bg-[#f1efe8] text-ink-soft",
  },
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] ${STATUS[status].className}`}
  >
    {STATUS[status].label}
  </span>
);
