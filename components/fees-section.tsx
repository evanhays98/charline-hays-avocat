import { Reveal } from "@/components/motion/reveal";

export const FeesSection = () => (
  <section id="honoraires" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto grid max-w-5xl gap-9 px-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          Honoraires
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-balance text-navy md:text-4xl">
          Transparence et confiance
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-col gap-5 text-[#3a4256]">
        <p>
          La transparence est essentielle à une relation de confiance. Mes
          honoraires font l'objet d'une{" "}
          <strong>convention d'honoraires</strong> établie dès le premier
          rendez-vous, adaptée à la nature et à la complexité de votre dossier
          — au forfait ou au temps passé.
        </p>
        <p>
          La première consultation permet d'évaluer votre situation et de vous
          communiquer une estimation claire avant tout engagement.
        </p>
      </Reveal>
    </div>
  </section>
);
