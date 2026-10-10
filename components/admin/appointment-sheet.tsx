"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MapPin, Phone, Video, X, type LucideIcon } from "lucide-react";
import {
  APPOINTMENT_MESSAGES,
  CONSULTATION_FORMATS,
  SUBJECTS,
  type ConsultationFormatValue,
} from "@/lib/content";
import type {
  AdminBooking,
  AdminCommand,
  CommandOptions,
  NewClient,
} from "@/lib/admin-api";
import { formatSlotLong } from "@/lib/dates";
import { subjectLabel } from "@/lib/booking-labels";
import { AdminButton } from "@/components/admin/admin-button";
import { AdminField } from "@/components/admin/admin-field";
import { SlotChooser } from "@/components/admin/slot-chooser";
import { EmailPreview } from "@/components/admin/email-preview";

export type SheetMode =
  { kind: "plan"; booking: AdminBooking } | { kind: "create" };

interface AppointmentSheetProps {
  mode: SheetMode;
  busy: boolean;
  onClose: () => void;
  onSubmit: (command: AdminCommand, options: CommandOptions) => void;
}

const FORMAT_ICONS: Record<ConsultationFormatValue, LucideIcon> = {
  cabinet: MapPin,
  visio: Video,
  telephone: Phone,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY_CLIENT: NewClient = {
  fullName: "",
  email: "",
  phone: "",
  subject: "autre",
};

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="border-b border-line px-4 py-5 md:px-6">
    <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
      {title}
    </h3>
    {children}
  </section>
);

export const AppointmentSheet = ({
  mode,
  busy,
  onClose,
  onSubmit,
}: AppointmentSheetProps) => {
  const booking = mode.kind === "plan" ? mode.booking : null;
  const rescheduling = booking?.status === "confirmed";
  const [client, setClient] = useState<NewClient>(EMPTY_CLIENT);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [format, setFormat] = useState<ConsultationFormatValue>(
    booking?.format ?? "cabinet",
  );
  const [editedMessage, setEditedMessage] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);

  const defaultMessage =
    APPOINTMENT_MESSAGES[rescheduling ? "reschedule" : "schedule"][format];
  const message = editedMessage ?? defaultMessage;
  const recipient = booking ? booking.email : client.email.trim();
  const emailValid = !recipient || EMAIL_PATTERN.test(recipient);
  const canEmail = Boolean(recipient) && emailValid;
  const clientValid =
    mode.kind === "plan" || (client.fullName.trim().length > 1 && emailValid);
  const ready = startsAt !== null && clientValid;

  const command = useMemo<AdminCommand | null>(() => {
    if (!startsAt) return null;
    if (booking) {
      return { action: "schedule", bookingId: booking.id, startsAt, format };
    }
    return {
      action: "create",
      client: {
        ...client,
        fullName: client.fullName.trim() || "Client",
        email: client.email.trim(),
        phone: client.phone.trim(),
      },
      startsAt,
      format,
    };
  }, [booking, client, startsAt, format]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const updateClient = (patch: Partial<NewClient>) =>
    setClient({ ...client, ...patch });

  const submit = () => {
    if (!command || !ready) return;
    onSubmit(command, { notify: notify && canEmail, message });
  };

  const title = booking
    ? rescheduling
      ? "Déplacer le rendez-vous"
      : "Fixer le rendez-vous"
    : "Nouveau rendez-vous";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-navy-deep/45 backdrop-blur-[2px] md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-title"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-3xl animate-[rdv-rise_0.3s_ease-out] flex-col bg-paper md:h-auto md:max-h-[92vh] md:border-t-[3px] md:border-navy md:shadow-[0_30px_70px_-30px_rgba(12,26,56,0.6)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line bg-paper px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 md:px-6 md:pt-5">
          <div className="min-w-0">
            <h2
              id="appointment-title"
              className="font-serif text-2xl text-navy"
            >
              {title}
            </h2>
            {booking ? (
              <p className="mt-0.5 truncate text-sm text-ink-soft">
                {booking.fullName} · {subjectLabel(booking.subject)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="-mr-2 grid size-11 shrink-0 cursor-pointer place-items-center text-ink-soft hover:text-navy"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {mode.kind === "create" ? (
            <Section title="Client">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <AdminField
                    id="new-client-name"
                    label="Nom et prénom"
                    autoComplete="off"
                    value={client.fullName}
                    onChange={(event) =>
                      updateClient({ fullName: event.target.value })
                    }
                  />
                </div>
                <AdminField
                  id="new-client-phone"
                  label="Téléphone"
                  type="tel"
                  autoComplete="off"
                  value={client.phone}
                  onChange={(event) =>
                    updateClient({ phone: event.target.value })
                  }
                />
                <AdminField
                  id="new-client-email"
                  label="Email"
                  type="email"
                  autoComplete="off"
                  aria-invalid={!emailValid}
                  value={client.email}
                  onChange={(event) =>
                    updateClient({ email: event.target.value })
                  }
                />
              </div>
              {!emailValid ? (
                <p className="mt-2 text-[13px] text-[#b4533c]">
                  Email invalide
                </p>
              ) : null}
              <div
                role="group"
                aria-label="Objet"
                className="mt-4 flex flex-wrap gap-2"
              >
                {SUBJECTS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={client.subject === id}
                    onClick={() => updateClient({ subject: id })}
                    className={`min-h-10 cursor-pointer border px-3.5 text-[13.5px] font-semibold transition-colors ${
                      client.subject === id
                        ? "border-navy bg-navy text-paper"
                        : "border-line bg-white text-ink-soft hover:border-navy hover:text-navy"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Date et heure">
            <SlotChooser
              availability={booking?.availability ?? []}
              value={startsAt}
              onChange={setStartsAt}
            />
          </Section>

          <Section title="Format">
            <div
              role="group"
              aria-label="Format"
              className="grid grid-cols-3 border border-line bg-white"
            >
              {CONSULTATION_FORMATS.map(({ value, label }) => {
                const Icon = FORMAT_ICONS[value];
                const active = value === format;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFormat(value)}
                    className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 border-l border-line text-sm font-semibold transition-colors first:border-l-0 ${
                      active
                        ? "bg-navy/6 text-navy shadow-[inset_0_-2px_0_var(--color-gold)]"
                        : "text-ink-soft hover:text-navy"
                    }`}
                  >
                    <Icon className="size-4 text-gold" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
            {booking && booking.format !== format ? (
              <p className="mt-2 text-[13px] text-ink-soft">
                Demandé :{" "}
                {
                  CONSULTATION_FORMATS.find(
                    ({ value }) => value === booking.format,
                  )?.label
                }
              </p>
            ) : null}
          </Section>

          <Section title="Email au client">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-ink">
              <input
                type="checkbox"
                checked={notify && canEmail}
                disabled={!canEmail}
                onChange={(event) => setNotify(event.target.checked)}
                className="size-4.5 accent-navy"
              />
              {canEmail ? (
                <span className="min-w-0 truncate">
                  Envoyer à <strong>{recipient}</strong>
                </span>
              ) : (
                <span className="text-ink-soft">
                  Pas d&apos;email à envoyer
                </span>
              )}
            </label>
            {notify && canEmail ? (
              <div className="mt-3 grid gap-3">
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="appointment-message"
                      className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                    >
                      Message
                    </label>
                    {editedMessage !== null ? (
                      <button
                        type="button"
                        onClick={() => setEditedMessage(null)}
                        className="cursor-pointer text-xs font-semibold text-ink-soft underline-offset-4 hover:text-navy hover:underline"
                      >
                        Texte par défaut
                      </button>
                    ) : null}
                  </div>
                  <textarea
                    id="appointment-message"
                    value={message}
                    maxLength={4000}
                    onChange={(event) => setEditedMessage(event.target.value)}
                    className="min-h-32 w-full resize-y border border-line bg-white px-3.5 py-3 text-[15px] leading-relaxed text-ink focus:border-navy focus:outline-none"
                  />
                </div>
                {command ? (
                  <EmailPreview command={command} message={message} />
                ) : (
                  <p className="text-sm text-ink-soft">
                    Choisissez une date pour voir l&apos;email
                  </p>
                )}
              </div>
            ) : null}
          </Section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-line bg-paper px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p className="font-serif text-lg text-navy">
            {startsAt ? formatSlotLong(startsAt) : "Date à choisir"}
          </p>
          <div className="flex gap-2">
            <AdminButton
              variant="ghost"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Annuler
            </AdminButton>
            <AdminButton
              busy={busy}
              disabled={!ready}
              onClick={submit}
              className="flex-[2] sm:flex-none"
            >
              {notify && canEmail ? "Confirmer et envoyer" : "Confirmer"}
            </AdminButton>
          </div>
        </footer>
      </div>
    </div>
  );
};
