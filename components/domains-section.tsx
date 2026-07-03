import { DOMAINS } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

export const DomainsSection = () => (
  <section id="domaines" className="scroll-mt-21 py-23">
    <div className="mx-auto max-w-5xl px-7">
      <Reveal>
        <SectionHeading
          eyebrow="Domaines d'intervention"
          title="Le droit de la famille, exclusivement"
          intro="J'interviens exclusivement en droit de la famille, devant les juridictions d'Île-de-France et les Cours d'appel de Paris et de Versailles."
        />
      </Reveal>
      <Stagger className="mt-12 grid md:grid-cols-2 md:gap-x-14">
        {DOMAINS.map(({ title, description }) => (
          <StaggerItem key={title} className="border-t border-line py-5.5">
            <h3 className="font-serif text-xl font-medium text-navy">
              {title}
            </h3>
            <p className="mt-1.5 text-[15px] text-ink-soft">{description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  </section>
);
