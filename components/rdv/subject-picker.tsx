import { SUBJECTS, type SubjectId } from "@/lib/content";
import { BlockLabel } from "@/components/rdv/block-label";

interface SubjectPickerProps {
  value: SubjectId | null;
  onChange: (value: SubjectId | null) => void;
  showError: boolean;
}

export const SubjectPicker = ({
  value,
  onChange,
  showError,
}: SubjectPickerProps) => (
  <fieldset id="rdv-objet" className="scroll-mt-28">
    <BlockLabel id="rdv-objet-label" required={{ done: value !== null }}>
      Objet
    </BlockLabel>
    <div
      role="group"
      aria-labelledby="rdv-objet-label"
      className="mt-2.5 flex flex-wrap gap-2"
    >
      {SUBJECTS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(value === id ? null : id)}
          className={`min-h-10 cursor-pointer border px-3.5 text-[13.5px] font-semibold transition-colors ${
            value === id
              ? "border-[#f4efe1] bg-[#f4efe1] text-navy"
              : showError
                ? "border-[#e0745b]/60 text-[#d5dcea] hover:border-gold-soft"
                : "border-white/14 text-[#d5dcea] hover:border-gold-soft"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
    {showError ? (
      <p className="mt-2 text-[12.5px] text-[#f09a85]">Choisissez un objet</p>
    ) : null}
  </fieldset>
);
