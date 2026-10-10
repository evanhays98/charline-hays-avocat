"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  fromIsoDate,
  mondayOf,
  monthName,
  toIsoDate,
} from "@/lib/dates";

export interface DateRange {
  start: string | null;
  end: string | null;
}

interface RangeCalendarProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  minDate: string;
}

const WEEKDAY_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

const nextRange = ({ start, end }: DateRange, day: string): DateRange => {
  if (!start || end) return { start: day, end: null };
  if (day < start) return { start: day, end: null };
  return { start, end: day };
};

export const RangeCalendar = ({
  value,
  onChange,
  minDate,
}: RangeCalendarProps) => {
  const min = fromIsoDate(minDate);
  const [month, setMonth] = useState(
    new Date(min.getFullYear(), min.getMonth(), 1),
  );
  const firstCell = mondayOf(month);
  const cells = Array.from({ length: 42 }, (_, index) =>
    addDays(firstCell, index),
  );
  const rangeEnd = value.end ?? value.start;
  const canGoBack = month > new Date(min.getFullYear(), min.getMonth(), 1);

  return (
    <div className="border-y border-line bg-white py-3 md:border md:px-3">
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="Mois précédent"
          disabled={!canGoBack}
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          className="grid size-9 cursor-pointer place-items-center text-navy hover:bg-navy/5 disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft className="size-4.5" aria-hidden="true" />
        </button>
        <p className="font-serif text-lg text-navy first-letter:uppercase">
          {monthName(month)} {month.getFullYear()}
        </p>
        <button
          type="button"
          aria-label="Mois suivant"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          className="grid size-9 cursor-pointer place-items-center text-navy hover:bg-navy/5"
        >
          <ChevronRight className="size-4.5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-bold text-ink-soft">
        {WEEKDAY_HEADERS.map((label, index) => (
          <span key={index} className="py-1.5">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          const key = toIsoDate(cell);
          const outside = cell.getMonth() !== month.getMonth();
          const disabled = key < minDate;
          const edge = key === value.start || key === rangeEnd;
          const inside =
            value.start !== null &&
            rangeEnd !== null &&
            key > value.start &&
            key < rangeEnd;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={edge || inside}
              onClick={() => onChange(nextRange(value, key))}
              className={`h-10 cursor-pointer text-sm tabular-nums transition-colors disabled:cursor-default disabled:text-ink-soft/30 ${
                edge
                  ? "bg-navy font-semibold text-paper"
                  : inside
                    ? "bg-navy/8 text-navy"
                    : outside
                      ? "text-ink-soft/50 hover:bg-navy/5"
                      : "text-ink hover:bg-navy/5"
              }`}
            >
              {cell.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
