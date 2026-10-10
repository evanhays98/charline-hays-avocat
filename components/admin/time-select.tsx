const TIMES = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  invalid?: boolean;
}

export const TimeSelect = ({
  value,
  onChange,
  label,
  invalid = false,
}: TimeSelectProps) => (
  <select
    aria-label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`min-h-10 cursor-pointer border bg-white px-2.5 text-sm tabular-nums text-ink transition-colors focus:border-navy focus:outline-none ${invalid ? "border-[#b4533c]" : "border-line hover:border-navy/40"}`}
  >
    {(TIMES.includes(value) ? TIMES : [value, ...TIMES]).map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </select>
);
