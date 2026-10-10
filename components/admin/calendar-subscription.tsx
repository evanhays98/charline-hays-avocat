"use client";

import { useState } from "react";
import { CalendarPlus, Copy, RefreshCw } from "lucide-react";
import {
  fetchCalendarFeedUrl,
  regenerateCalendarFeedUrl,
} from "@/lib/admin-api";
import { useQuery } from "@/lib/use-query";
import { AdminButton } from "@/components/admin/admin-button";
import type { Toast } from "@/components/admin/admin-toast";

interface CalendarSubscriptionProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

const webcalOf = (url: string) => url.replace(/^https?:/, "webcal:");

const googleSubscribeUrl = (url: string) =>
  `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalOf(url))}`;

const linkButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors";

export const CalendarSubscription = ({ notify }: CalendarSubscriptionProps) => {
  const query = useQuery("calendar-feed", fetchCalendarFeedUrl);
  const [regenerated, setRegenerated] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const url = regenerated ?? query.data;

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    notify("success", "Lien copié");
  };

  const regenerate = async () => {
    setBusy(true);
    try {
      setRegenerated(await regenerateCalendarFeedUrl());
      setConfirmingReset(false);
      notify("success", "Nouveau lien créé, l'ancien ne fonctionne plus");
    } catch {
      notify("error", "Impossible de créer un nouveau lien");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="border-b border-navy pb-2.5 font-serif text-xl text-navy">
        Agenda
      </h2>
      <p className="mt-4 text-[15px] text-ink-soft">
        Les rendez-vous confirmés s&apos;ajoutent automatiquement à votre
        agenda.
      </p>
      {url ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href={googleSubscribeUrl(url)}
            target="_blank"
            rel="noreferrer"
            className={`${linkButtonClass} bg-navy text-paper hover:bg-navy-deep`}
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            Google Agenda
          </a>
          <a
            href={webcalOf(url)}
            className={`${linkButtonClass} border border-line bg-paper text-navy hover:border-navy`}
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            iPhone / Mac
          </a>
          <AdminButton
            variant="ghost"
            onClick={copy}
            icon={<Copy className="size-4" aria-hidden="true" />}
          >
            Copier le lien
          </AdminButton>
          {confirmingReset ? (
            <AdminButton variant="danger" busy={busy} onClick={regenerate}>
              Invalider l&apos;ancien lien
            </AdminButton>
          ) : (
            <AdminButton
              variant="ghost"
              onClick={() => setConfirmingReset(true)}
              icon={<RefreshCw className="size-4" aria-hidden="true" />}
            >
              Nouveau lien
            </AdminButton>
          )}
        </div>
      ) : (
        <div className="mt-4 h-24 animate-pulse bg-navy/5" />
      )}
    </section>
  );
};
