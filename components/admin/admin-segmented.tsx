interface SegmentedOption<T> {
  value: T;
  label: string;
}

interface AdminSegmentedProps<T> {
  label: string;
  value: T | null;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}

export const AdminSegmented = <T extends string | number>({
  label,
  value,
  options,
  onChange,
}: AdminSegmentedProps<T>) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
      {label}
    </p>
    <div
      role="group"
      aria-label={label}
      className="mt-2 grid border border-line bg-white"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`min-h-11 cursor-pointer border-l border-line px-2 text-sm font-semibold transition-colors first:border-l-0 ${
              active
                ? "bg-navy/6 text-navy shadow-[inset_0_-2px_0_var(--color-gold)]"
                : "text-ink-soft hover:bg-navy/3 hover:text-navy"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);
