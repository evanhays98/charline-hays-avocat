import { Check, Euro, FileText, type LucideIcon } from "lucide-react";
import { FEES } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

const FEE_ICONS: LucideIcon[] = [FileText, Euro, Check];

export const FeesSection = () => (
  <section
    id="honoraires"
    className="scroll-mt-21 border-t border-line py-18 md:py-23"
  >
    <div className="mx-auto grid max-w-5xl gap-9 px-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
          Honoraires
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-balance text-navy md:text-4xl">
          Transparence et confiance
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="grid border-t border-line sm:grid-cols-3">
        {FEES.map(({ title, description }, index) => {
          const Icon = FEE_ICONS[index];
          return (
            <div
              key={title}
              className="flex gap-3.5 border-b border-line py-4.5 sm:flex-col sm:gap-3 sm:border-b-0 sm:border-l sm:pt-5.5 sm:pr-4 sm:pl-4.5 sm:first:border-l-0 sm:first:pl-0"
            >
              <Icon
                className="size-5.5 shrink-0 text-gold"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <div>
                <p className="font-serif text-[19px] font-medium text-navy">
                  {title}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </div>
  </section>
);
