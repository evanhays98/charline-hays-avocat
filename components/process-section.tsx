import { PROCESS_STEPS } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";

export const ProcessSection = () => (
  <section id="deroule" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto max-w-5xl px-7">
      <SectionHeading
        eyebrow="Comment ça se passe"
        title="Quatre étapes, en toute clarté"
      />
      <div className="mt-13 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {PROCESS_STEPS.map(({ title, description }, index) => (
          <div key={title} className="border-t-2 border-gold pt-3.5">
            <div className="font-serif text-2xl leading-none text-gold">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-2.5 text-[15px] font-semibold uppercase tracking-[0.06em] text-navy">
              {title}
            </h3>
            <p className="mt-2 text-[14.5px] text-ink-soft">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
