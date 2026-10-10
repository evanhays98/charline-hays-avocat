"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFreeSlots, type AdminBooking } from "@/lib/admin-api";
import {
  atLocalTime,
  formatSlotLong,
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
import { AdminButton } from "@/components/admin/admin-button";
import { TimeSelect } from "@/components/admin/time-select";

const WEEKS_AHEAD = 8;

interface ScheduleFormProps {
  booking: AdminBooking;
  busy: boolean;
  onSubmit: (startsAt: string, notify: boolean) => void;
  onClose: () => void;
}

interface WeekPlannerProps extends ScheduleFormProps {
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
  booking,
  busy,
  onSubmit,
  onClose,
}: WeekPlannerProps) => {
  const [weekIndex, setWeekIndex] = useState(() =>
    initialWeek(todayIso, booking.availability),
  );
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);
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
  const preferredDays = booking.availability.map((key) => key.slice(0, 10));
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
    booking.availability.includes(`${instantDayKey(iso)}|${periodOf(iso)}`);
  const pastDay = activeDay < todayIso;

  const goToWeek = (index: number) => {
    setWeekIndex(index);
    setPickedDay(null);
  };

  const chooseDay = (key: string) => {
    setPickedDay(key);
    setCustomTime(null);
  };

  const chooseCustomTime = (time: string) => {
    setCustomTime(time);
    setStartsAt(atLocalTime(fromIsoDate(activeDay), time).toISOString());
  };

  return (
    <div className="col-span-full border-t border-line bg-white px-4 py-5 md:border md:px-5">
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
        ) : daySlots.length === 0 ? (
          <p className="py-2.5 text-sm text-ink-soft">
            Aucun créneau libre ce jour
          </p>
        ) : (
          <div
            role="group"
            aria-label="Heure"
            className="grid grid-cols-4 gap-1.5 sm:grid-cols-6"
          >
            {daySlots.map((slot) => {
              const selected = startsAt === slot && customTime === null;
              const preferred = isPreferred(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setStartsAt(slot);
                    setCustomTime(null);
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
          </div>
        )}
      </div>

      {!pastDay ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          Autre heure
          <TimeSelect
            label="Autre heure"
            value={customTime ?? "12:00"}
            onChange={chooseCustomTime}
          />
        </div>
      ) : null}

      <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-ink">
        <input
          type="checkbox"
          checked={notify}
          onChange={(event) => setNotify(event.target.checked)}
          className="size-4.5 accent-navy"
        />
        Envoyer la confirmation par email à {booking.fullName}
      </label>

      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-lg text-navy">
          {startsAt ? formatSlotLong(startsAt) : "—"}
        </p>
        <div className="flex gap-2">
          <AdminButton variant="ghost" onClick={onClose} className="flex-1">
            Fermer
          </AdminButton>
          <AdminButton
            busy={busy}
            disabled={!startsAt}
            onClick={() => startsAt && onSubmit(startsAt, notify)}
            className="flex-1"
          >
            Confirmer
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export const ScheduleForm = (props: ScheduleFormProps) => {
  const todayIso = useTodayIso();
  if (!todayIso) return null;
  return <WeekPlanner todayIso={todayIso} {...props} />;
};
