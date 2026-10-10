import { MapPin, Phone, Video, type LucideIcon } from "lucide-react";
import {
  CONSULTATION_FORMATS,
  type ConsultationFormatValue,
} from "@/lib/content";
import { BlockLabel } from "@/components/rdv/block-label";

const FORMAT_ICONS: Record<ConsultationFormatValue, LucideIcon> = {
  cabinet: MapPin,
  visio: Video,
  telephone: Phone,
};

interface FormatPickerProps {
  value: ConsultationFormatValue;
  onChange: (value: ConsultationFormatValue) => void;
}

export const FormatPicker = ({ value, onChange }: FormatPickerProps) => (
  <div>
    <BlockLabel id="rdv-format-label">Format</BlockLabel>
    <div
      role="group"
      aria-labelledby="rdv-format-label"
      className="mt-2.5 grid grid-cols-3 border border-white/14"
    >
      {CONSULTATION_FORMATS.map(({ value: formatValue, label }) => {
        const Icon = FORMAT_ICONS[formatValue];
        const active = value === formatValue;
        return (
          <button
            key={formatValue}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(formatValue)}
            className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 border-l border-white/14 text-[13.5px] font-semibold transition-colors first:border-l-0 ${
              active
                ? "bg-gold-soft/16 text-white shadow-[inset_0_-2px_0_var(--color-gold-soft)]"
                : "text-[#c9d2e4] hover:bg-white/5"
            }`}
          >
            <Icon className="size-4 text-gold-soft" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  </div>
);
