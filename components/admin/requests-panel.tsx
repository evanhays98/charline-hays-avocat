import { CalendarCheck, Inbox, RotateCw } from "lucide-react";
import type { AdminAction, AdminBooking, AdminCommand } from "@/lib/admin-api";
import { BookingCard } from "@/components/admin/booking-card";
import { AdminButton } from "@/components/admin/admin-button";

export interface BusyAction {
  id: string;
  action: AdminAction;
}

interface RequestsPanelProps {
  bookings: AdminBooking[] | null;
  failed: boolean;
  onRetry: () => void;
  busy: BusyAction | null;
  onAction: (
    booking: AdminBooking,
    command: AdminCommand,
    notify: boolean,
  ) => void;
}

interface SectionProps {
  title: string;
  bookings: AdminBooking[];
  empty: { icon: typeof Inbox; label: string };
  busy: BusyAction | null;
  onAction: (
    booking: AdminBooking,
    command: AdminCommand,
    notify: boolean,
  ) => void;
}

const Section = ({
  title,
  bookings,
  empty: { icon: EmptyIcon, label },
  busy,
  onAction,
}: SectionProps) => (
  <section className="mt-8 first:mt-0">
    <h2 className="flex items-center gap-3 border-b border-navy pb-2.5 font-serif text-xl text-navy">
      {title}
      <span className="grid min-w-6 place-items-center bg-navy/8 px-1.5 font-sans text-xs font-bold text-navy">
        {bookings.length}
      </span>
    </h2>
    {bookings.length === 0 ? (
      <p className="flex items-center gap-3 border-b border-line py-8 text-[15px] text-ink-soft">
        <EmptyIcon className="size-5 text-gold" aria-hidden="true" />
        {label}
      </p>
    ) : (
      bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          busyAction={busy?.id === booking.id ? busy.action : null}
          onAction={onAction}
        />
      ))
    )}
  </section>
);

const Skeleton = () => (
  <div aria-hidden="true" className="grid gap-3">
    {[0, 1, 2].map((index) => (
      <div key={index} className="h-28 animate-pulse bg-navy/5" />
    ))}
  </div>
);

export const RequestsPanel = ({
  bookings,
  failed,
  onRetry,
  busy,
  onAction,
}: RequestsPanelProps) => {
  if (failed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white px-5 py-4 text-ink-soft">
        Chargement impossible
        <AdminButton
          variant="secondary"
          onClick={onRetry}
          icon={<RotateCw className="size-4" aria-hidden="true" />}
        >
          Réessayer
        </AdminButton>
      </div>
    );
  }
  if (!bookings) return <Skeleton />;

  return (
    <>
      <Section
        title="Nouvelles demandes"
        bookings={bookings.filter(({ status }) => status === "pending")}
        empty={{ icon: Inbox, label: "Aucune demande à traiter" }}
        busy={busy}
        onAction={onAction}
      />
      <Section
        title="Rendez-vous à venir"
        bookings={bookings
          .filter(({ status }) => status === "confirmed")
          .sort((left, right) =>
            (left.startsAt ?? "").localeCompare(right.startsAt ?? ""),
          )}
        empty={{ icon: CalendarCheck, label: "Aucun rendez-vous confirmé" }}
        busy={busy}
        onAction={onAction}
      />
    </>
  );
};
