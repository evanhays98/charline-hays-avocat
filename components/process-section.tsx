import { PROCESS_STEPS } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

export const ProcessSection = () => (
  <section
    id="deroule"
    className="scroll-mt-21 border-t border-line py-18 md:py-23"
  >
    <div className="mx-auto max-w-5xl px-7">
      <Reveal>
        <SectionHeading
          eyebrow="Comment ça se passe"
          title="Quatre étapes, en toute clarté"
        />
      </Reveal>
      <Stagger className="mt-11 grid lg:mt-13 lg:grid-cols-4 lg:gap-10">
        {PROCESS_STEPS.map(({ title, description }, index) => (
          <StaggerItem
            key={title}
            className="group relative pb-7 pl-10 last:pb-0 lg:border-t-2 lg:border-gold lg:pt-3.5 lg:pb-0 lg:pl-0"
          >
            <span className="absolute top-8 bottom-1 left-2.5 w-px bg-line group-last:hidden lg:hidden" />
            <div className="absolute top-0 left-0 font-serif text-lg leading-none text-gold lg:static lg:text-2xl">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-navy lg:mt-2.5">
              {title}
            </h3>
            <p className="mt-1.5 text-[14.5px] text-ink-soft">{description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  </section>
);
