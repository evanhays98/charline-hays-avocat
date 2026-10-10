interface RecapRow {
  label: string;
  value: string | null;
}

interface RdvRecapProps {
  rows: RecapRow[];
}

export const RdvRecap = ({ rows }: RdvRecapProps) => (
  <dl className="mt-6.5 grid gap-2 border-t border-white/14 pt-4.5 text-[13.5px]">
    {rows.map(({ label, value }) => (
      <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-2.5">
        <dt className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-mist">
          {label}
        </dt>
        <dd className={value ? "text-[#e3e8f2]" : "text-mist/55"}>
          {value ?? "—"}
        </dd>
      </div>
    ))}
  </dl>
);
