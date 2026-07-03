import { CAREER, EDUCATION } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { TimelineColumn } from "@/components/timeline-column";

export const TimelineSection = () => (
  <section id="parcours" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto max-w-5xl px-7">
      <SectionHeading
        eyebrow="Parcours & formation"
        title="Une formation dédiée à la pratique judiciaire"
      />
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        <TimelineColumn heading="Parcours" entries={CAREER} />
        <TimelineColumn heading="Formation" entries={EDUCATION} />
      </div>
    </div>
  </section>
);
