import { Check } from "lucide-react";
import { RdvRecap } from "@/components/rdv/rdv-recap";

interface RdvSuccessProps {
  email: string;
  rows: { label: string; value: string | null }[];
  onReset: () => void;
}

export const RdvSuccess = ({ email, rows, onReset }: RdvSuccessProps) => (
  <div role="status" className="animate-[rdv-rise_0.5s_ease-out]">
    <span className="grid size-12 place-items-center rounded-full bg-[#7cc4a0]/15 text-[#a8dcc0]">
      <Check className="size-6" aria-hidden="true" />
    </span>
    <h3 className="mt-5 font-serif text-2xl font-medium text-white">
      Demande envoyée
    </h3>
    <p className="mt-2 text-[15px] text-[#c9d2e4]">
      Récapitulatif envoyé à <span className="text-white">{email}</span>
    </p>
    <RdvRecap rows={rows} />
    <button
      type="button"
      onClick={onReset}
      className="mt-6 min-h-12 cursor-pointer border border-white/30 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold-soft hover:text-gold-soft"
    >
      Nouvelle demande
    </button>
  </div>
);
