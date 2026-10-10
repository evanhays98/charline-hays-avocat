"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { TrackedLink } from "@/components/analytics/tracked-link";

const WATCHED_IDS = ["haut", "contact"];

interface MobileActionBarProps {
  alwaysVisible?: boolean;
}

export const MobileActionBar = ({
  alwaysVisible = false,
}: MobileActionBarProps) => {
  const [visibleIds, setVisibleIds] = useState<string[]>(
    alwaysVisible ? [] : ["haut"],
  );

  useEffect(() => {
    if (alwaysVisible) return;
    const observer = new IntersectionObserver((entries) =>
      setVisibleIds((current) =>
        entries.reduce(
          (ids, { target, isIntersecting }) =>
            isIntersecting
              ? [...ids.filter((id) => id !== target.id), target.id]
              : ids.filter((id) => id !== target.id),
          current,
        ),
      ),
    );
    WATCHED_IDS.map((id) => document.getElementById(id))
      .filter((element) => element !== null)
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [alwaysVisible]);

  const shown = visibleIds.length === 0;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-line bg-paper/94 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-400 ease-out sm:hidden ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <TrackedLink
        href={CONTACT.phoneHref}
        event="appel_clic"
        properties={{ emplacement: "barre_mobile" }}
        className="flex min-h-12.5 items-center justify-center gap-2 bg-navy text-xs font-bold uppercase tracking-[0.14em] text-white"
      >
        <Phone className="size-4" aria-hidden="true" />
        Appeler
      </TrackedLink>
      <TrackedLink
        href="/#contact"
        event="rdv_cta_clic"
        properties={{ emplacement: "barre_mobile" }}
        className="flex min-h-12.5 items-center justify-center gap-2 border border-navy text-xs font-bold uppercase tracking-[0.14em] text-navy"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        Rendez-vous
      </TrackedLink>
    </div>
  );
};
