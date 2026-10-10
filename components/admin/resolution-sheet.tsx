"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { RESOLUTION_MESSAGES } from "@/lib/content";
import {
  isScheduledBooking,
  type AdminBooking,
  type AdminCommand,
  type CommandOptions,
} from "@/lib/admin-api";
import { formatSlotLong } from "@/lib/dates";
import { subjectLabel } from "@/lib/booking-labels";
import { AdminButton } from "@/components/admin/admin-button";
import { EmailPreview } from "@/components/admin/email-preview";

export type Resolution = "decline" | "cancel";

interface ResolutionSheetProps {
  booking: AdminBooking;
  resolution: Resolution;
  busy: boolean;
  onClose: () => void;
  onSubmit: (command: AdminCommand, options: CommandOptions) => void;
}

const TITLES: Record<Resolution, string> = {
  decline: "Refuser la demande",
  cancel: "Annuler le rendez-vous",
};

const ACTION_LABELS: Record<
  Resolution,
  { withEmail: string; without: string }
> = {
  decline: { withEmail: "Refuser et envoyer", without: "Refuser sans email" },
  cancel: { withEmail: "Annuler et envoyer", without: "Annuler sans email" },
};

export const ResolutionSheet = ({
  booking,
  resolution,
  busy,
  onClose,
  onSubmit,
}: ResolutionSheetProps) => {
  const canEmail = Boolean(booking.email);
  const [notify, setNotify] = useState(canEmail);
  const [editedMessage, setEditedMessage] = useState<string | null>(null);
  const message = editedMessage ?? RESOLUTION_MESSAGES[resolution];
  const command = useMemo<AdminCommand>(
    () => ({ action: resolution, bookingId: booking.id }),
    [resolution, booking.id],
  );

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

  const sending = notify && canEmail;
  const labels = ACTION_LABELS[resolution];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/45 backdrop-blur-[2px] md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolution-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92svh] w-full max-w-xl animate-[rdv-rise_0.3s_ease-out] flex-col border-t-[3px] border-navy bg-paper shadow-[0_30px_70px_-30px_rgba(12,26,56,0.6)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-4 pt-4 pb-4 md:px-6 md:pt-5">
          <div className="min-w-0">
            <h2 id="resolution-title" className="font-serif text-2xl text-navy">
              {TITLES[resolution]}
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink-soft">
              {booking.fullName} · {subjectLabel(booking.subject)}
              {isScheduledBooking(booking)
                ? ` · ${formatSlotLong(booking.startsAt)}`
                : ""}
            </p>
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

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 md:px-6">
          <div
            role="radiogroup"
            aria-label="Email au client"
            className="grid gap-2"
          >
            {[
              {
                value: true,
                label: canEmail
                  ? `Prévenir par email (${booking.email})`
                  : "Prévenir par email",
                disabled: !canEmail,
              },
              { value: false, label: "Ne rien envoyer", disabled: false },
            ].map((option) => {
              const checked = sending === option.value;
              return (
                <label
                  key={String(option.value)}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 border px-3.5 py-2.5 text-[15px] transition-colors ${
                    checked
                      ? "border-navy bg-white text-navy"
                      : "border-line text-ink-soft hover:border-navy/40"
                  } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="resolution-notify"
                    checked={checked}
                    disabled={option.disabled}
                    onChange={() => setNotify(option.value)}
                    className="size-4.5 accent-navy"
                  />
                  <span className="min-w-0 truncate">{option.label}</span>
                </label>
              );
            })}
          </div>

          {sending ? (
            <div className="mt-5 grid gap-3">
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="resolution-message"
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
                  id="resolution-message"
                  value={message}
                  maxLength={4000}
                  onChange={(event) => setEditedMessage(event.target.value)}
                  className="min-h-32 w-full resize-y border border-line bg-white px-3.5 py-3 text-[15px] leading-relaxed text-ink focus:border-navy focus:outline-none"
                />
              </div>
              <EmailPreview command={command} message={message} />
            </div>
          ) : null}
        </div>

        <footer className="flex gap-2 border-t border-line px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:justify-end md:px-6">
          <AdminButton
            variant="ghost"
            onClick={onClose}
            className="flex-1 md:flex-none"
          >
            Retour
          </AdminButton>
          <AdminButton
            variant="danger"
            busy={busy}
            onClick={() => onSubmit(command, { notify: sending, message })}
            className="flex-[2] md:flex-none"
          >
            {sending ? labels.withEmail : labels.without}
          </AdminButton>
        </footer>
      </div>
    </div>
  );
};
