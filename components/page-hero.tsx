import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  crumb: string;
  children?: ReactNode;
}

export const PageHero = ({
  eyebrow,
  title,
  intro,
  crumb,
  children,
}: PageHeroProps) => (
  <header className="relative overflow-hidden bg-navy text-[#edf0f7]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_10%,rgba(201,174,107,0.1),transparent_60%)]" />
    <div className="relative mx-auto max-w-5xl px-7 pt-8 pb-12 md:pt-10 md:pb-16">
      <Breadcrumbs
        items={[{ label: "Accueil", href: "/" }, { label: crumb }]}
      />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.1] font-medium text-balance text-white md:text-5xl">
        {title}
      </h1>
      <div className="mt-5 h-0.5 w-14 bg-gold" />
      <p className="mt-5 max-w-2xl font-serif text-xl leading-snug text-[#d5dcea]">
        {intro}
      </p>
      {children}
    </div>
  </header>
);
