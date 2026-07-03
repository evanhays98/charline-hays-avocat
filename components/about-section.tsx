import { Reveal } from "@/components/motion/reveal";

export const AboutSection = () => (
  <section id="a-propos" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto grid max-w-5xl gap-9 px-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          À propos
        </p>
        <p className="mt-4 font-serif text-2xl leading-normal text-balance text-navy">
          « Le droit de la famille est un domaine où le droit touche à
          l'intime. Chaque dossier est unique. »
        </p>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-col gap-5 text-[#3a4256]">
        <p>
          Inscrite au Barreau de Paris depuis 2021, j'ai fait le choix de me
          consacrer entièrement au droit de la famille.
        </p>
        <p>
          J'accompagne mes clients avec{" "}
          <strong>écoute, réactivité et rigueur</strong>, en recherchant
          d'abord des solutions négociées, sans jamais renoncer à défendre
          fermement leurs intérêts lorsque le contentieux s'impose.
        </p>
        <p>
          Mon rôle : vous expliquer clairement vos droits, définir avec vous
          une stratégie adaptée à votre situation, et vous tenir informé à
          chaque étape de la procédure.
        </p>
      </Reveal>
    </div>
  </section>
);
