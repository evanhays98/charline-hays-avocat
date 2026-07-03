import { CAREER, EDUCATION } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { TimelineColumn } from "@/components/timeline-column";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

export const TimelineSection = () => (
  <section id="parcours" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto max-w-5xl px-7">
      <Reveal>
        <SectionHeading
          eyebrow="Parcours & formation"
          title="Une formation dédiée à la pratique judiciaire"
        />
      </Reveal>
      <Stagger className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        <StaggerItem>
          <TimelineColumn heading="Parcours" entries={CAREER} />
        </StaggerItem>
        <StaggerItem>
          <TimelineColumn heading="Formation" entries={EDUCATION} />
        </StaggerItem>
      </Stagger>
    </div>
  </section>
);
