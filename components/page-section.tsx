import type { ReactNode } from "react";

interface PageSectionProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export const PageSection = ({ eyebrow, title, children }: PageSectionProps) => (
  <section className="border-t border-line py-14 first:border-t-0 md:py-18">
    <div className="mx-auto max-w-5xl px-7">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-3 mb-8 font-serif text-3xl font-medium text-balance text-navy md:text-4xl">
        {title}
      </h2>
      {children}
    </div>
  </section>
);
