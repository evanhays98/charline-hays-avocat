"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  fetchBookingsBetween,
  fetchTimeOffBetween,
  isScheduledBooking,
  type AdminBooking,
} from "@/lib/admin-api";
import {
  addDays,
  formatTime,
  formatWeekRange,
  fromIsoDate,
  toIsoDate,
  weekOf,
  weekdayShort,
} from "@/lib/dates";
import { subjectLabel } from "@/lib/booking-labels";
import { useQuery } from "@/lib/use-query";
import { useTodayIso } from "@/lib/use-today";
import { BookingCard } from "@/components/admin/booking-card";
import type { Resolution } from "@/components/admin/resolution-sheet";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminButton } from "@/components/admin/admin-button";
import type { BusyAction } from "@/components/admin/requests-panel";

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 56;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, index) => START_HOUR + index,
);

interface AgendaPanelProps {
  version: number;
  busy: BusyAction | null;
  onResolve: (booking: AdminBooking, resolution: Resolution) => void;
  onPlan: (booking: AdminBooking) => void;
}

interface WeekAgendaProps extends AgendaPanelProps {
  todayIso: string;
}

const minutesFrom = (day: Date, iso: string) =>
  (new Date(iso).getTime() - day.getTime()) / 60000;

const segment = (day: Date, startsAt: string, endsAt: string) => {
  const top = Math.max(minutesFrom(day, startsAt), START_HOUR * 60);
  const bottom = Math.min(minutesFrom(day, endsAt), END_HOUR * 60);
  if (bottom <= top) return null;
  return {
    top: ((top - START_HOUR * 60) * HOUR_HEIGHT) / 60,
    height: ((bottom - top) * HOUR_HEIGHT) / 60,
  };
};

const sameDay = (day: Date, iso: string) =>
  toIsoDate(day) === toIsoDate(new Date(iso));

const navButtonClass =
  "grid size-10 cursor-pointer place-items-center border border-line bg-paper text-navy transition-colors hover:border-navy";

const WeekAgenda = ({
  todayIso,
  version,
  busy,
  onResolve,
  onPlan,
}: WeekAgendaProps) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = fromIsoDate(todayIso);
  const days = weekOf(today, weekIndex);
  const fromIso = days[0].toISOString();
  const toIso = addDays(days[6], 1).toISOString();
  const query = useQuery(`agenda:${fromIso}:${version}`, async () => {
    const [bookings, timeOff] = await Promise.all([
      fetchBookingsBetween(fromIso, toIso),
      fetchTimeOffBetween(fromIso, toIso),
    ]);
    return { bookings, timeOff };
  });

  const bookings = (query.data?.bookings ?? []).filter(isScheduledBooking);
  const timeOff = query.data?.timeOff ?? [];
  const visibleDays = days.filter(
    (day, index) =>
      index < 6 || bookings.some(({ startsAt }) => sameDay(day, startsAt)),
  );
  const selected = bookings.find(({ id }) => id === selectedId) ?? null;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNow =
    weekIndex === 0 &&
    nowMinutes >= START_HOUR * 60 &&
    nowMinutes < END_HOUR * 60;

  const goToWeek = (index: number) => {
    setWeekIndex(index);
    setSelectedId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-navy">
          {formatWeekRange(days)}
        </h2>
        <div className="flex items-center gap-1.5">
          {weekIndex !== 0 ? (
            <AdminButton variant="ghost" onClick={() => goToWeek(0)}>
              Aujourd&apos;hui
            </AdminButton>
          ) : null}
          <button
            type="button"
            aria-label="Semaine précédente"
            onClick={() => goToWeek(weekIndex - 1)}
            className={navButtonClass}
          >
            <ChevronLeft className="size-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Semaine suivante"
            onClick={() => goToWeek(weekIndex + 1)}
            className={navButtonClass}
          >
            <ChevronRight className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        aria-busy={query.loading}
        className={`mt-5 hidden border border-line bg-white transition-opacity md:block ${query.loading ? "opacity-60" : ""}`}
      >
        <div
          className="grid border-b border-line"
          style={{
            gridTemplateColumns: `3.5rem repeat(${visibleDays.length}, minmax(0, 1fr))`,
          }}
        >
          <div />
          {visibleDays.map((day) => {
            const isToday = toIsoDate(day) === todayIso;
            return (
              <div
                key={toIsoDate(day)}
                className="border-l border-line py-2.5 text-center"
              >
                <span
                  className={`block text-[10.5px] font-bold uppercase tracking-[0.14em] ${isToday ? "text-gold" : "text-ink-soft"}`}
                >
                  {weekdayShort(day)}
                </span>
                <span
                  className={`mt-0.5 inline-grid size-8 place-items-center font-serif text-lg ${isToday ? "bg-navy text-paper" : "text-navy"}`}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `3.5rem repeat(${visibleDays.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="relative">
            {HOURS.map((hour, index) => (
              <span
                key={hour}
                style={{ top: Math.max(index * HOUR_HEIGHT - 7, 2) }}
                className="absolute right-2 text-[11px] tabular-nums text-ink-soft"
              >
                {`${hour}h`}
              </span>
            ))}
          </div>
          {visibleDays.map((day) => {
            const isToday = toIsoDate(day) === todayIso;
            return (
              <div
                key={toIsoDate(day)}
                className={`relative border-l border-line ${isToday ? "bg-gold/4" : ""}`}
                style={{ height: HOURS.length * HOUR_HEIGHT }}
              >
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: HOUR_HEIGHT }}
                    className="border-b border-line/70"
                  />
                ))}
                {timeOff.map((item) => {
                  const position = segment(day, item.startsAt, item.endsAt);
                  if (!position) return null;
                  return (
                    <div
                      key={item.id}
                      className="absolute inset-x-0 bg-[repeating-linear-gradient(135deg,rgba(19,38,75,0.07)_0_6px,transparent_6px_12px)] px-2 py-1.5 text-[11px] font-semibold text-ink-soft"
                      style={position}
                    >
                      {item.label ?? "Absence"}
                    </div>
                  );
                })}
                {bookings
                  .filter(({ startsAt }) => sameDay(day, startsAt))
                  .map((booking) => {
                    const position = segment(
                      day,
                      booking.startsAt,
                      booking.endsAt,
                    );
                    if (!position) return null;
                    const pending = booking.status === "pending";
                    const active = booking.id === selectedId;
                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() =>
                          setSelectedId(active ? null : booking.id)
                        }
                        className={`absolute inset-x-1 cursor-pointer overflow-hidden px-2 py-1 text-left text-xs transition-shadow ${
                          pending
                            ? "border border-dashed border-gold bg-[#fbf6ea] text-navy"
                            : "bg-navy text-paper"
                        } ${active ? "ring-2 ring-gold ring-offset-1" : "hover:shadow-[0_6px_16px_-8px_rgba(19,38,75,0.6)]"}`}
                        style={{
                          top: position.top + 1,
                          height: position.height - 2,
                        }}
                      >
                        <span className="block font-semibold tabular-nums">
                          {formatTime(booking.startsAt)}
                        </span>
                        <span className="block truncate">
                          {booking.fullName}
                        </span>
                      </button>
                    );
                  })}
                {isToday && showNow ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 h-0.5 bg-[#c95f47]"
                    style={{
                      top: ((nowMinutes - START_HOUR * 60) * HOUR_HEIGHT) / 60,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 md:hidden">
        {query.loading ? (
          <div className="h-40 animate-pulse bg-navy/5" />
        ) : (
          visibleDays.map((day) => {
            const dayBookings = bookings.filter(({ startsAt }) =>
              sameDay(day, startsAt),
            );
            const isToday = toIsoDate(day) === todayIso;
            return (
              <div key={toIsoDate(day)} className="border-b border-line py-3">
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.14em] ${isToday ? "text-gold" : "text-ink-soft"}`}
                >
                  {weekdayShort(day)} {day.getDate()}
                </p>
                {dayBookings.length === 0 ? (
                  <p className="mt-1 text-sm text-ink-soft/70">—</p>
                ) : (
                  dayBookings.map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => setSelectedId(booking.id)}
                      className={`mt-2 flex w-full cursor-pointer items-center gap-3 border px-3 py-2.5 text-left ${booking.id === selectedId ? "border-navy bg-white" : "border-line bg-white/60"}`}
                    >
                      <span className="text-sm font-semibold tabular-nums text-navy">
                        {formatTime(booking.startsAt)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">
                          {booking.fullName}
                        </span>
                        <span className="block text-xs text-ink-soft">
                          {subjectLabel(booking.subject)}
                        </span>
                      </span>
                      <StatusBadge status={booking.status} />
                    </button>
                  ))
                )}
              </div>
            );
          })
        )}
      </div>

      {selected ? (
        <div className="mt-6 border-t-2 border-navy bg-white/70 px-4 md:px-6">
          <div className="flex justify-end pt-3">
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setSelectedId(null)}
              className="grid size-9 cursor-pointer place-items-center text-ink-soft hover:text-navy"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
          </div>
          <BookingCard
            booking={selected}
            busyAction={busy?.id === selected.id ? busy.action : null}
            onResolve={onResolve}
            onPlan={onPlan}
          />
        </div>
      ) : null}
    </div>
  );
};

export const AgendaPanel = (props: AgendaPanelProps) => {
  const todayIso = useTodayIso();
  if (!todayIso) return <div className="h-96 animate-pulse bg-navy/5" />;
  return <WeekAgenda todayIso={todayIso} {...props} />;
};
