"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Phone } from "lucide-react";
import {
  CONTACT,
  FAQ_ENTRIES,
  SITUATIONS,
  type SituationId,
} from "@/lib/content";
import { selectSubject } from "@/lib/subject-store";
import { trackEvent } from "@/lib/track";
import { SituationIcon } from "@/components/situation-icon";
import { TrackedLink } from "@/components/analytics/tracked-link";

const buttonBase =
  "inline-flex min-h-13 items-center justify-center gap-2.5 px-5.5 text-[12.5px] font-bold uppercase tracking-[0.14em] transition-colors";

export const SituationPicker = () => {
  const [selectedId, setSelectedId] = useState<SituationId | null>(null);
  const selected = SITUATIONS.find(({ id }) => id === selectedId);
  const faq = FAQ_ENTRIES.find(({ id }) => id === selected?.faqId);

  const toggle = (id: SituationId) => {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    if (next) trackEvent("situation_choisie", { situation: next });
  };

  return (
    <div className="mt-9">
      <p className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.2em] text-mist">
        Votre situation
      </p>
      <div
        role="group"
        aria-label="Votre situation"
        className="grid grid-cols-2 border-t border-l border-white/14 sm:grid-cols-3"
      >
        {SITUATIONS.map(({ id, label, urgent }) => {
          const active = id === selectedId;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(id)}
              className={`relative flex min-h-15 cursor-pointer items-center gap-2.5 border-r border-b border-white/14 px-3.5 py-3 text-left text-[14.5px] font-semibold transition-colors duration-300 ${
                active
                  ? "bg-[#f4efe1] text-navy"
                  : "text-[#e3e8f2] hover:bg-white/5"
              }`}
            >
              <SituationIcon
                situation={id}
                className={`size-4.5 shrink-0 transition-transform duration-300 ${
                  active ? "scale-110 text-gold" : "text-gold-soft"
                }`}
                strokeWidth={1.6}
              />
              {label}
              {urgent ? (
                <span className="absolute top-2.5 right-2.5 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#e0745b] opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#e0745b]" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {selected ? (
            <div
              className={`grid gap-4 border-b border-white/14 pt-5.5 pb-5 sm:grid-cols-[1fr_auto] sm:items-end ${
                selected.urgent ? "border-l-2 border-l-[#e0745b] pl-4" : ""
              }`}
            >
              <div>
                <h2 className="font-serif text-[22px] font-medium text-white">
                  {selected.title}
                </h2>
                <p className="mt-1.5 max-w-[52ch] text-[15px] text-[#c9d2e4]">
                  {selected.description}
                </p>
                {faq ? (
                  <a
                    href={`#${faq.id}`}
                    className="mt-2.5 inline-flex items-center gap-1.5 border-b border-gold-soft/40 pb-px text-[13.5px] text-gold-soft transition-colors hover:border-gold-soft"
                  >
                    {faq.question}
                    <ArrowRight
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
              </div>
              {selected.urgent ? (
                <TrackedLink
                  href={CONTACT.phoneHref}
                  event="appel_clic"
                  properties={{ emplacement: "urgence" }}
                  className={`${buttonBase} bg-[#e0745b] text-white hover:bg-[#c95f47]`}
                >
                  <Phone className="size-4.5" aria-hidden="true" />
                  Appeler maintenant
                </TrackedLink>
              ) : (
                <a
                  href="#contact"
                  onClick={() => selectSubject(selected.id)}
                  className={`${buttonBase} bg-white text-navy hover:bg-gold-soft`}
                >
                  <CalendarDays className="size-4.5" aria-hidden="true" />
                  Préparer ma demande
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {selected ? null : (
        <div className="mt-6.5 flex flex-wrap gap-3">
          <TrackedLink
            href={CONTACT.phoneHref}
            event="appel_clic"
            properties={{ emplacement: "hero" }}
            className={`${buttonBase} bg-white text-navy hover:bg-gold-soft`}
          >
            <Phone className="size-4.5" aria-hidden="true" />
            {CONTACT.phone}
          </TrackedLink>
          <TrackedLink
            href="#contact"
            event="rdv_cta_clic"
            properties={{ emplacement: "hero" }}
            className={`${buttonBase} border border-white/40 text-white hover:border-gold-soft hover:text-gold-soft`}
          >
            <CalendarDays className="size-4.5" aria-hidden="true" />
            Demander un rendez-vous
          </TrackedLink>
        </div>
      )}
    </div>
  );
};
