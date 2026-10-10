import { DOMAINS } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { DomainLink } from "@/components/domain-link";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

export const DomainsSection = () => (
  <section id="domaines" className="scroll-mt-21 py-18 md:py-23">
    <div className="mx-auto max-w-5xl px-7">
      <Reveal>
        <SectionHeading
          eyebrow="Domaines d'intervention"
          title="Le droit de la famille, exclusivement"
          intro="J'interviens exclusivement en droit de la famille, devant les juridictions d'Île-de-France et les Cours d'appel de Paris et de Versailles."
        />
      </Reveal>
      <Stagger className="mt-10 border-t border-navy">
        {DOMAINS.map((domain, index) => (
          <StaggerItem key={domain.title}>
            <DomainLink domain={domain} index={index} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  </section>
);
