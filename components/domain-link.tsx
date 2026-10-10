"use client";

import { ArrowRight } from "lucide-react";
import type { Domain } from "@/lib/content";
import { trackEvent } from "@/lib/track";

interface DomainLinkProps {
  domain: Domain;
  index: number;
}

export const DomainLink = ({
  domain: { title, description, situation, slug },
  index,
}: DomainLinkProps) => (
  <a
    href={`/domaines/${slug}`}
    onClick={() => trackEvent("domaine_clic", { situation })}
    className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 border-b border-line py-5 transition-[padding,background-color] duration-300 hover:bg-linear-to-r hover:from-gold/7 hover:to-transparent hover:pl-2.5"
  >
    <span
      className={`font-serif text-lg ${situation === "etranger" ? "text-[#c95f47]" : "text-gold"}`}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
    <span>
      <span className="block font-serif text-xl font-medium text-navy md:text-[23px]">
        {title}
      </span>
      <span className="mt-0.5 block text-[14.5px] text-ink-soft">
        {description}
      </span>
    </span>
    <span className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-navy opacity-35 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
      <span className="hidden md:inline">En savoir plus</span>
      <ArrowRight className="size-4.5" aria-hidden="true" />
    </span>
  </a>
);
