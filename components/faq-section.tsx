import { SectionHeading } from "@/components/section-heading";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/motion/reveal";

export const FaqSection = () => (
  <section
    id="faq"
    className="scroll-mt-21 border-t border-line py-18 md:py-23"
  >
    <div className="mx-auto max-w-5xl px-7">
      <Reveal>
        <SectionHeading
          eyebrow="Questions fréquentes"
          title="Vous vous demandez peut-être…"
        />
      </Reveal>
      <Reveal>
        <FaqList />
      </Reveal>
    </div>
  </section>
);
