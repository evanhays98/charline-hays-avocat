import type { ChangeEvent } from "react";
import { RequiredDot } from "@/components/rdv/required-dot";

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
  maxLength?: number;
  required?: { valid: boolean; error?: string };
  className?: string;
}

const controlClass =
  "peer w-full rounded-none border bg-white/4 px-3.5 pt-5.5 pb-2 text-[15.5px] text-white transition-colors focus:bg-white/7 focus:outline-none";

export const FloatingField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  multiline = false,
  maxLength,
  required,
  className = "",
}: FloatingFieldProps) => {
  const error = required?.error;
  const borderClass = error
    ? "border-[#e0745b]"
    : "border-white/14 focus:border-gold-soft";
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(event.target.value);
  const shared = {
    id,
    name: id,
    value,
    placeholder: " ",
    onChange: handleChange,
    onBlur,
    maxLength,
    required: Boolean(required),
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-erreur` : undefined,
  };

  return (
    <div className={`relative ${className}`}>
      {multiline ? (
        <textarea
          {...shared}
          className={`${controlClass} ${borderClass} min-h-30 resize-y`}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={`${controlClass} ${borderClass}`}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-1.5 left-3.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-mist transition-all duration-200 peer-placeholder-shown:top-3.75 peer-placeholder-shown:text-[14.5px] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:text-[10.5px] peer-focus:font-bold peer-focus:tracking-[0.14em] peer-focus:uppercase"
      >
        {required ? <RequiredDot done={required.valid} /> : null}
        {label}
        {required ? null : (
          <span className="text-mist/70 normal-case tracking-normal">
            · facultatif
          </span>
        )}
      </label>
      {error ? (
        <p id={`${id}-erreur`} className="mt-1.5 text-[12.5px] text-[#f09a85]">
          {error}
        </p>
      ) : null}
    </div>
  );
};
