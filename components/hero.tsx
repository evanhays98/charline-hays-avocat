import Image from "next/image";
import { CONTACT } from "@/lib/content";

export const Hero = () => (
  <header id="haut" className="bg-navy text-[#edf0f7]">
    <div className="mx-auto grid max-w-5xl gap-12 px-7 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-21">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-soft">
          Avocate au Barreau de Paris
        </p>
        <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.05] text-white sm:text-6xl md:text-7xl">
          Charline Hays
        </h1>
        <div className="mt-5 h-0.5 w-14 bg-gold" />
        <p className="mt-6 max-w-md text-lg text-[#c9d2e4]">
          Un accompagnement humain et rigoureux, à chaque étape de votre vie
          familiale. Divorce, enfants, patrimoine : je défends vos intérêts en
          privilégiant les solutions amiables et, lorsqu'il le faut, devant les
          tribunaux.
        </p>
        <p className="mt-5 text-[13px] uppercase tracking-[0.12em] text-mist">
          Droit de la famille · Divorce · Filiation · Enlèvements
          internationaux d'enfants
        </p>
        <div className="mt-9 flex flex-wrap gap-3.5">
          <a
            href={CONTACT.phoneHref}
            className="bg-white px-6 py-4 text-[13px] font-semibold uppercase tracking-widest text-navy transition-colors hover:bg-gold-soft"
          >
            Appeler — {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="border border-white/45 px-6 py-4 text-[13px] font-semibold uppercase tracking-widest text-white transition-colors hover:border-gold-soft hover:text-gold-soft"
          >
            Écrire un email
          </a>
        </div>
      </div>
      <div className="relative max-w-90 md:justify-self-end">
        <Image
          src="/portrait.jpg"
          alt="Portrait de Maître Charline Hays"
          width={503}
          height={690}
          priority
          className="w-full object-cover"
        />
        <div className="pointer-events-none absolute -top-2 -left-2 h-9 w-9 border-l-[1.5px] border-t-[1.5px] border-gold" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-9 w-9 border-b-[1.5px] border-r-[1.5px] border-gold" />
      </div>
    </div>
  </header>
);
