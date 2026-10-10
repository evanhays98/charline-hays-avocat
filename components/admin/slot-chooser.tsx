"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFreeSlots } from "@/lib/admin-api";
import {
  atLocalTime,
  formatTime,
  formatWeekRange,
  fromIsoDate,
  instantDayKey,
  mondayOf,
  nextBusinessDay,
  toIsoDate,
  weekOf,
  weekdayShort,
} from "@/lib/dates";
import { useQuery } from "@/lib/use-query";
import { useTodayIso } from "@/lib/use-today";
import { Clock } from "lucide-react";
import { TimePicker } from "@/components/admin/time-picker";

const WEEKS_AHEAD = 8;

interface SlotChooserProps {
  availability: string[];
  value: string | null;
  onChange: (startsAt: string) => void;
}

interface WeekPlannerProps extends SlotChooserProps {
  todayIso: string;
}

const periodOf = (iso: string) =>
  Number(formatTime(iso).slice(0, 2)) < 13 ? "matin" : "apres-midi";

const DAY_MS = 24 * 60 * 60 * 1000;

const initialWeek = (todayIso: string, availability: string[]) => {
  const today = fromIsoDate(todayIso);
  const [firstPreferred] = availability
    .map((key) => key.slice(0, 10))
    .filter((day) => day >= todayIso)
    .sort();
  const target = firstPreferred
    ? fromIsoDate(firstPreferred)
    : nextBusinessDay(today);
  const weeks = Math.floor(
    (mondayOf(target).getTime() - mondayOf(today).getTime()) / (7 * DAY_MS) +
      0.5,
  );
  return Math.min(Math.max(weeks, 0), WEEKS_AHEAD - 1);
};

const navButtonClass =
  "grid size-10 cursor-pointer place-items-center border border-line bg-white text-navy transition-colors enabled:hover:border-navy disabled:cursor-default disabled:opacity-30";

const WeekPlanner = ({
  todayIso,
  availability,
  value,
  onChange,
}: WeekPlannerProps) => {
  const [weekIndex, setWeekIndex] = useState(() =>
    initialWeek(todayIso, availability),
  );
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const days = weekOf(fromIsoDate(todayIso), weekIndex);
  const rangeStart = toIsoDate(days[0]);
  const rangeEnd = toIsoDate(days[6]);
  const query = useQuery(`free:${rangeStart}`, () =>
    fetchFreeSlots(rangeStart, rangeEnd),
  );

  const slots = query.data ?? [];
  const slotsByDay = slots.reduce<Record<string, string[]>>((groups, slot) => {
    const key = instantDayKey(slot.startsAt);
    return { ...groups, [key]: [...(groups[key] ?? []), slot.startsAt] };
  }, {});
  const preferredDays = availability.map((key) => key.slice(0, 10));
  const visibleDays = days.filter(
    (day, index) => index < 5 || (slotsByDay[toIsoDate(day)]?.length ?? 0) > 0,
  );
  const defaultDay =
    visibleDays
      .map(toIsoDate)
      .find((key) => preferredDays.includes(key) && slotsByDay[key]) ??
    visibleDays.map(toIsoDate).find((key) => slotsByDay[key]) ??
    toIsoDate(visibleDays[0]);
  const activeDay = pickedDay ?? defaultDay;
  const daySlots = slotsByDay[activeDay] ?? [];
  const isPreferred = (iso: string) =>
    availability.includes(`${instantDayKey(iso)}|${periodOf(iso)}`);
  const pastDay = activeDay < todayIso;

  const goToWeek = (index: number) => {
    setWeekIndex(index);
    setPickedDay(null);
  };

  const chooseDay = (key: string) => {
    setPickedDay(key);
    setCustomTime(null);
    setCustomOpen(false);
  };

  const chooseCustomTime = (time: string) => {
    setCustomTime(time);
    onChange(atLocalTime(fromIsoDate(activeDay), time).toISOString());
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-lg text-navy">{formatWeekRange(days)}</p>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Semaine précédente"
            disabled={weekIndex === 0}
            onClick={() => goToWeek(weekIndex - 1)}
            className={navButtonClass}
          >
            <ChevronLeft className="size-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Semaine suivante"
            disabled={weekIndex === WEEKS_AHEAD - 1}
            onClick={() => goToWeek(weekIndex + 1)}
            className={navButtonClass}
          >
            <ChevronRight className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-label="Jour"
        className="mt-3 grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))`,
        }}
      >
        {visibleDays.map((day) => {
          const key = toIsoDate(day);
          const active = key === activeDay;
          const preferred = preferredDays.includes(key);
          const past = key < todayIso;
          return (
            <button
              key={key}
              type="button"
              disabled={past}
              aria-pressed={active}
              onClick={() => chooseDay(key)}
              className={`relative flex cursor-pointer flex-col items-center border py-2 transition-colors disabled:cursor-default disabled:opacity-30 ${
                active
                  ? "border-navy bg-navy text-paper"
                  : "border-line text-navy enabled:hover:border-navy"
              }`}
            >
              <span
                className={`text-[10.5px] font-bold uppercase tracking-[0.14em] ${active ? "text-gold-soft" : "text-ink-soft"}`}
              >
                {weekdayShort(day)}
              </span>
              <span className="font-serif text-xl leading-none">
                {day.getDate()}
              </span>
              <span
                aria-hidden="true"
                className={`mt-1.5 size-1.5 rounded-full ${preferred ? "bg-gold" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-11">
        {query.loading ? (
          <div className="h-11 animate-pulse bg-navy/5" />
        ) : (
          <div
            role="group"
            aria-label="Heure"
            className="grid grid-cols-4 gap-1.5 sm:grid-cols-6"
          >
            {daySlots.length === 0 ? (
              <p className="col-span-3 flex min-h-11 items-center text-sm text-ink-soft sm:col-span-5">
                Aucun créneau libre
              </p>
            ) : null}
            {daySlots.map((slot) => {
              const selected = value === slot && customTime === null;
              const preferred = isPreferred(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(slot);
                    setCustomTime(null);
                    setCustomOpen(false);
                  }}
                  className={`min-h-11 cursor-pointer border text-sm font-semibold tabular-nums transition-colors ${
                    selected
                      ? "border-navy bg-navy text-paper"
                      : preferred
                        ? "border-gold bg-gold/8 text-navy hover:border-navy"
                        : "border-line text-navy hover:border-navy"
                  }`}
                >
                  {formatTime(slot)}
                </button>
              );
            })}
            {!pastDay ? (
              <button
                type="button"
                aria-expanded={customOpen}
                aria-pressed={customTime !== null}
                onClick={() => setCustomOpen(!customOpen)}
                className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 border text-sm font-semibold tabular-nums transition-colors ${
                  customTime !== null
                    ? "border-navy bg-navy text-paper"
                    : "border-dashed border-navy/40 text-navy hover:border-navy"
                }`}
              >
                <Clock className="size-3.5" aria-hidden="true" />
                {customTime ?? "Autre"}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {!pastDay && customOpen ? (
        <div className="mt-2">
          <TimePicker value={customTime} onChange={chooseCustomTime} />
        </div>
      ) : null}
    </div>
  );
};

export const SlotChooser = (props: SlotChooserProps) => {
  const todayIso = useTodayIso();
  if (!todayIso) return null;
  return <WeekPlanner todayIso={todayIso} {...props} />;
};
