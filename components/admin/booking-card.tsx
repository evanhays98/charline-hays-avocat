"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  Inbox,
  Mail,
  MapPin,
  Phone,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ConsultationFormatValue } from "@/lib/content";
import {
  isScheduledBooking,
  type AdminAction,
  type AdminBooking,
  type AdminCommand,
  type CommandOptions,
} from "@/lib/admin-api";
import {
  formatAvailability,
  formatDayParts,
  formatShortDate,
  formatSlotLong,
  formatTime,
} from "@/lib/dates";
import { formatLabel, subjectLabel } from "@/lib/booking-labels";
import { AdminButton } from "@/components/admin/admin-button";
import { StatusBadge } from "@/components/admin/status-badge";

const FORMAT_ICONS: Record<ConsultationFormatValue, LucideIcon> = {
  cabinet: MapPin,
  visio: Video,
  telephone: Phone,
};

interface BookingCardProps {
  booking: AdminBooking;
  busyAction: AdminAction | null;
  onPlan: (booking: AdminBooking) => void;
  onAction: (command: AdminCommand, options: CommandOptions) => void;
}

const QUICK_OPTIONS: CommandOptions = { notify: true, message: "" };

const DateBlock = ({ startsAt }: { startsAt: string }) => {
  const { weekday, day, month } = formatDayParts(startsAt);
  return (
    <div className="hidden flex-col items-center border border-line bg-white py-2.5 text-center md:flex">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold">
        {weekday}
      </span>
      <span className="font-serif text-[28px] leading-none text-navy">
        {day}
      </span>
      <span className="text-xs text-ink-soft">{month}</span>
      <span className="mt-2 border-t border-line pt-1.5 text-[13px] font-semibold tabular-nums text-navy">
        {formatTime(startsAt)}
      </span>
    </div>
  );
};

const ReceivedBlock = ({ createdAt }: { createdAt: string }) => (
  <div className="hidden flex-col items-center gap-1 border border-dashed border-gold/60 bg-[#fbf6ea] py-3 text-center md:flex">
    <Inbox className="size-5 text-gold" aria-hidden="true" />
    <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8a6c22]">
      Reçue
    </span>
    <span className="text-xs text-ink-soft">{formatShortDate(createdAt)}</span>
  </div>
);

export const BookingCard = ({
  booking,
  busyAction,
  onPlan,
  onAction,
}: BookingCardProps) => {
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const FormatIcon = FORMAT_ICONS[booking.format];
  const busy = busyAction !== null;
  const scheduled = isScheduledBooking(booking);
  const availability = formatAvailability(booking.availability);

  return (
    <article className="grid gap-4 border-b border-line py-5 md:grid-cols-[5rem_1fr_11rem] md:items-start md:gap-x-5">
      {scheduled ? (
        <DateBlock startsAt={booking.startsAt} />
      ) : (
        <ReceivedBlock createdAt={booking.createdAt} />
      )}

      <div className="min-w-0">
        <p
          className={`mb-1.5 flex items-center gap-1.5 text-[13px] md:hidden ${scheduled ? "font-semibold text-navy" : "text-ink-soft"}`}
        >
          {scheduled ? (
            <CalendarCheck className="size-4 text-gold" aria-hidden="true" />
          ) : (
            <Inbox className="size-4 text-gold" aria-hidden="true" />
          )}
          {scheduled
            ? formatSlotLong(booking.startsAt)
            : `Reçue ${formatShortDate(booking.createdAt)}`}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[22px] leading-tight font-medium text-navy">
            {booking.fullName}
          </h3>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
          <span className="font-semibold text-ink">
            {subjectLabel(booking.subject)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <FormatIcon className="size-3.5 text-gold" aria-hidden="true" />
            {formatLabel(booking.format)}
          </span>
        </p>

        <div className="mt-3 grid gap-1 text-[15px]">
          {booking.phone ? (
            <a
              href={`tel:${booking.phone.replace(/\s/g, "")}`}
              className="inline-flex min-h-9 items-center gap-2.5 text-navy hover:text-gold"
            >
              <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
              {booking.phone}
            </a>
          ) : null}
          {booking.email ? (
            <a
              href={`mailto:${booking.email}`}
              className="inline-flex min-h-9 min-w-0 items-center gap-2.5 text-navy hover:text-gold"
            >
              <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="truncate">{booking.email}</span>
            </a>
          ) : null}
        </div>

        {!scheduled ? (
          <div className="mt-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              <CalendarClock
                className="size-3.5 text-gold"
                aria-hidden="true"
              />
              Disponibilités
            </p>
            {availability.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {availability.map((item) => (
                  <span
                    key={item}
                    className="border border-gold/40 bg-gold/8 px-2 py-1 text-[13px] text-navy"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ink-soft">Indifférent</p>
            )}
          </div>
        ) : null}

        {booking.message ? (
          <p className="mt-3 border-l-2 border-gold/60 bg-white px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-line text-ink">
            {booking.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {!confirmingCancel ? (
          <AdminButton
            variant={scheduled ? "secondary" : "primary"}
            disabled={busy}
            onClick={() => onPlan(booking)}
            icon={<CalendarCheck className="size-4" aria-hidden="true" />}
            className={scheduled ? "" : "col-span-2 md:col-span-1"}
          >
            {scheduled ? "Déplacer" : "Fixer le RDV"}
          </AdminButton>
        ) : null}
        {!scheduled ? (
          <AdminButton
            variant="danger"
            busy={busyAction === "decline"}
            disabled={busy}
            onClick={() =>
              onAction(
                { action: "decline", bookingId: booking.id },
                QUICK_OPTIONS,
              )
            }
            icon={<X className="size-4" aria-hidden="true" />}
            className="col-span-2 md:col-span-1"
          >
            Refuser
          </AdminButton>
        ) : null}
        {scheduled && !confirmingCancel ? (
          <AdminButton
            variant="ghost"
            disabled={busy}
            onClick={() => setConfirmingCancel(true)}
          >
            Annuler le RDV
          </AdminButton>
        ) : null}
        {scheduled && confirmingCancel ? (
          <>
            <AdminButton
              variant="danger"
              busy={busyAction === "cancel"}
              onClick={() =>
                onAction(
                  { action: "cancel", bookingId: booking.id },
                  QUICK_OPTIONS,
                )
              }
            >
              Confirmer
            </AdminButton>
            <AdminButton
              variant="ghost"
              disabled={busy}
              onClick={() => setConfirmingCancel(false)}
            >
              Garder
            </AdminButton>
          </>
        ) : null}
      </div>
    </article>
  );
};
