"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DAY_PERIODS,
  availabilityKey,
  formatWeekRange,
  fromIsoDate,
  nextBusinessDay,
  toIsoDate,
  weekOf,
  weekdayShort,
} from "@/lib/dates";
import { useTodayIso } from "@/lib/use-today";
import { BlockLabel } from "@/components/rdv/block-label";

const WEEKS_AHEAD = 3;

interface AvailabilityPickerProps {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
}

interface WeekGridProps extends AvailabilityPickerProps {
  todayIso: string;
}

const navButtonClass =
  "grid size-9 cursor-pointer place-items-center border border-white/14 text-[#c9d2e4] transition-colors enabled:hover:border-gold-soft enabled:hover:text-white disabled:cursor-default disabled:opacity-30";

const WeekGrid = ({ todayIso, value, onChange }: WeekGridProps) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const firstDay = nextBusinessDay(fromIsoDate(todayIso));
  const days = weekOf(firstDay, weekIndex).slice(0, 5);
  const firstKey = toIsoDate(firstDay);

  const toggle = (key: string) =>
    onChange((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <BlockLabel id="rdv-dispos-label">Disponibilités</BlockLabel>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Semaine précédente"
            disabled={weekIndex === 0}
            onClick={() => setWeekIndex(weekIndex - 1)}
            className={navButtonClass}
          >
            <ChevronLeft className="size-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Semaine suivante"
            disabled={weekIndex === WEEKS_AHEAD - 1}
            onClick={() => setWeekIndex(weekIndex + 1)}
            className={navButtonClass}
          >
            <ChevronRight className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-1 mb-2.5 flex min-h-6 items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white" aria-live="polite">
          {formatWeekRange(days)}
        </p>
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="cursor-pointer text-xs font-semibold text-mist underline-offset-4 hover:text-white hover:underline"
          >
            Effacer ({value.length})
          </button>
        ) : null}
      </div>
      <div
        role="group"
        aria-labelledby="rdv-dispos-label"
        className="grid grid-cols-5 gap-1.5"
      >
        {days.map((day) => {
          const past = toIsoDate(day) < firstKey;
          return (
            <div key={toIsoDate(day)} className="grid gap-1.5">
              <div className="border-b border-white/14 pt-1 pb-1.5 text-center">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-mist">
                  {weekdayShort(day)}
                </span>
                <span className="font-serif text-xl text-white">
                  {day.getDate()}
                </span>
              </div>
              {DAY_PERIODS.map((period) => {
                const key = availabilityKey(day, period);
                const selected = value.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={past}
                    aria-pressed={selected}
                    onClick={() => toggle(key)}
                    className={`min-h-11 cursor-pointer border text-xs font-semibold transition-colors disabled:cursor-default disabled:opacity-25 ${
                      selected
                        ? "border-gold-soft bg-gold-soft text-navy-deep"
                        : "border-white/14 text-[#c9d2e4] enabled:hover:border-gold-soft enabled:hover:text-white"
                    }`}
                  >
                    {period === "matin" ? (
                      "Matin"
                    ) : (
                      <>
                        <span className="sm:hidden">Ap.-midi</span>
                        <span className="hidden sm:inline">Après-midi</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AvailabilityPicker = (props: AvailabilityPickerProps) => {
  const todayIso = useTodayIso();
  if (!todayIso) return <div className="h-48 animate-pulse bg-white/5" />;
  return <WeekGrid todayIso={todayIso} {...props} />;
};
