import type { TimelineEntry } from "@/lib/content";

interface TimelineColumnProps {
  heading: string;
  entries: TimelineEntry[];
}

export const TimelineColumn = ({ heading, entries }: TimelineColumnProps) => (
  <div>
    <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
      {heading}
    </h3>
    {entries.map(({ date, title, detail }) => (
      <div
        key={title}
        className="relative border-l border-line pb-6.5 pl-6 last:pb-0 before:absolute before:top-2 before:-left-[3.5px] before:size-1.5 before:rounded-full before:bg-gold"
      >
        <span className="text-[12.5px] uppercase tracking-[0.1em] text-[#7a8296] tabular-nums">
          {date}
        </span>
        <h4 className="mt-1 font-serif text-lg font-medium text-navy">
          {title}
        </h4>
        <p className="text-[14.5px] text-ink-soft">{detail}</p>
      </div>
    ))}
  </div>
);
