const HOURS = Array.from({ length: 13 }, (_, index) => 8 + index);
const MINUTES = ["00", "15", "30", "45"];

interface TimePickerProps {
  value: string | null;
  onChange: (time: string) => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

const chipClass = (selected: boolean) =>
  `min-h-11 cursor-pointer border text-sm font-semibold tabular-nums transition-colors ${
    selected
      ? "border-navy bg-navy text-paper"
      : "border-line bg-white text-navy hover:border-navy"
  }`;

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const [hour, minute] = value ? value.split(":") : [null, "00"];

  return (
    <div className="grid gap-3 border-l-2 border-gold bg-white/60 py-3 pl-3">
      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
          Heure
        </p>
        <div
          role="group"
          aria-label="Heure personnalisée"
          className="grid grid-cols-5 gap-1.5 sm:grid-cols-7"
        >
          {HOURS.map((option) => {
            const label = pad(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={hour === label}
                onClick={() => onChange(`${label}:${minute}`)}
                className={chipClass(hour === label)}
              >
                {option} h
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
          Minutes
        </p>
        <div
          role="group"
          aria-label="Minutes"
          className="grid grid-cols-4 gap-1.5 sm:max-w-xs"
        >
          {MINUTES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={hour !== null && minute === option}
              disabled={hour === null}
              onClick={() => hour && onChange(`${hour}:${option}`)}
              className={`${chipClass(hour !== null && minute === option)} disabled:cursor-default disabled:opacity-40`}
            >
              :{option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
