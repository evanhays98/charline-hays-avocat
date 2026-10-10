import { VALUES } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export const AboutSection = () => (
  <section
    id="a-propos"
    className="scroll-mt-21 border-t border-line py-18 md:py-23"
  >
    <div className="mx-auto grid max-w-5xl gap-9 px-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
          À propos
        </p>
        <p className="mt-4 font-serif text-2xl leading-normal text-balance text-navy md:text-[27px]">
          « Le droit de la famille est un domaine où le droit touche à
          l&apos;intime. Chaque dossier est unique. »
        </p>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-col gap-5 text-[#3a4256]">
        <p>
          Inscrite au Barreau de Paris depuis 2021, j&apos;ai fait le choix de
          me consacrer entièrement au droit de la famille. Je recherche
          d&apos;abord des solutions négociées, sans jamais renoncer à défendre
          fermement vos intérêts lorsque le contentieux s&apos;impose.
        </p>
        <p>
          Mon rôle : vous expliquer clairement vos droits, définir avec vous une
          stratégie adaptée à votre situation, et vous tenir informé à chaque
          étape de la procédure.
        </p>
        <dl className="mt-2 grid grid-cols-3 border-t border-line">
          {VALUES.map(({ title, description }) => (
            <div
              key={title}
              className="border-l border-line pt-4 pr-3 pl-3.5 first:border-l-0 first:pl-0"
            >
              <dt className="font-serif text-[19px] font-medium text-navy">
                {title}
              </dt>
              <dd className="mt-0.5 text-[13px] leading-snug text-ink-soft">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
);
