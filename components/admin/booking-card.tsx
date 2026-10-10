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
} from "@/lib/admin-api";
import {
  formatAvailability,
  formatDayParts,
  formatShortDate,
  formatTime,
} from "@/lib/dates";
import { formatLabel, subjectLabel } from "@/lib/booking-labels";
import { AdminButton } from "@/components/admin/admin-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { ScheduleForm } from "@/components/admin/schedule-form";

const FORMAT_ICONS: Record<ConsultationFormatValue, LucideIcon> = {
  cabinet: MapPin,
  visio: Video,
  telephone: Phone,
};

interface BookingCardProps {
  booking: AdminBooking;
  busyAction: AdminAction | null;
  onAction: (
    booking: AdminBooking,
    command: AdminCommand,
    notify: boolean,
  ) => void;
}

const DateBlock = ({ startsAt }: { startsAt: string }) => {
  const { weekday, day, month } = formatDayParts(startsAt);
  return (
    <div className="flex flex-col items-center border border-line bg-white py-2.5 text-center">
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
  <div className="flex flex-col items-center gap-1 border border-dashed border-gold/60 bg-[#fbf6ea] py-3 text-center">
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
  onAction,
}: BookingCardProps) => {
  const [planning, setPlanning] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const FormatIcon = FORMAT_ICONS[booking.format];
  const busy = busyAction !== null;
  const scheduled = isScheduledBooking(booking);
  const availability = formatAvailability(booking.availability);

  return (
    <article className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-4 border-b border-line py-5 md:grid-cols-[5rem_1fr_auto] md:items-start">
      {scheduled ? (
        <DateBlock startsAt={booking.startsAt} />
      ) : (
        <ReceivedBlock createdAt={booking.createdAt} />
      )}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="font-serif text-xl font-medium text-navy">
            {booking.fullName}
          </h3>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
          <span className="font-semibold text-ink">
            {subjectLabel(booking.subject)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <FormatIcon className="size-3.5 text-gold" aria-hidden="true" />
            {formatLabel(booking.format)}
          </span>
        </p>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
          {booking.phone ? (
            <a
              href={`tel:${booking.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 text-navy hover:text-gold"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {booking.phone}
            </a>
          ) : null}
          <a
            href={`mailto:${booking.email}`}
            className="inline-flex min-w-0 items-center gap-1.5 break-all text-navy hover:text-gold"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            {booking.email}
          </a>
        </div>
        {!scheduled ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <CalendarClock
              className="mr-0.5 size-4 text-gold"
              aria-label="Disponibilités"
            />
            {availability.length > 0 ? (
              availability.map((item) => (
                <span
                  key={item}
                  className="border border-gold/40 bg-gold/8 px-2 py-0.5 text-[13px] text-navy"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-ink-soft">Indifférent</span>
            )}
          </div>
        ) : null}
        {booking.message ? (
          <p className="mt-3 border-l-2 border-gold/60 bg-white px-3.5 py-2.5 text-sm whitespace-pre-line text-ink-soft">
            {booking.message}
          </p>
        ) : null}
      </div>

      <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:w-44 md:flex-col">
        {!planning && !confirmingCancel ? (
          <AdminButton
            variant={scheduled ? "secondary" : "primary"}
            disabled={busy}
            onClick={() => setPlanning(true)}
            icon={<CalendarCheck className="size-4" aria-hidden="true" />}
            className="flex-1 md:flex-none"
          >
            {scheduled ? "Déplacer" : "Fixer le RDV"}
          </AdminButton>
        ) : null}
        {!scheduled && !planning ? (
          <AdminButton
            variant="danger"
            busy={busyAction === "decline"}
            disabled={busy}
            onClick={() => onAction(booking, { action: "decline" }, true)}
            icon={<X className="size-4" aria-hidden="true" />}
            className="flex-1 md:flex-none"
          >
            Refuser
          </AdminButton>
        ) : null}
        {scheduled && !planning && !confirmingCancel ? (
          <AdminButton
            variant="ghost"
            disabled={busy}
            onClick={() => setConfirmingCancel(true)}
            className="flex-1 md:flex-none"
          >
            Annuler le RDV
          </AdminButton>
        ) : null}
        {scheduled && confirmingCancel ? (
          <>
            <AdminButton
              variant="danger"
              busy={busyAction === "cancel"}
              onClick={() => onAction(booking, { action: "cancel" }, true)}
              className="flex-1 md:flex-none"
            >
              Confirmer l&apos;annulation
            </AdminButton>
            <AdminButton
              variant="ghost"
              disabled={busy}
              onClick={() => setConfirmingCancel(false)}
              className="flex-1 md:flex-none"
            >
              Garder
            </AdminButton>
          </>
        ) : null}
      </div>

      {planning ? (
        <ScheduleForm
          booking={booking}
          busy={busyAction === "schedule"}
          onClose={() => setPlanning(false)}
          onSubmit={(startsAt, notify) =>
            onAction(booking, { action: "schedule", startsAt }, notify)
          }
        />
      ) : null}
    </article>
  );
};
