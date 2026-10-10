import Image from "next/image";
import { SituationPicker } from "@/components/situation-picker";

export const Hero = () => (
  <header id="haut" className="relative overflow-hidden bg-navy text-[#edf0f7]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_10%,rgba(201,174,107,0.1),transparent_60%)]" />
    <div className="relative mx-auto grid max-w-5xl md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-14 md:px-7 md:py-20">
      <div className="relative md:order-2 md:w-full md:max-w-82 md:justify-self-end">
        <div className="relative aspect-[4/4.4] max-h-[72svh] w-full overflow-hidden md:aspect-[503/640] md:max-h-none">
          <Image
            src="/portrait.webp"
            alt="Maître Charline HAYS, avocate en droit de la famille à Paris"
            width={503}
            height={690}
            priority
            className="size-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-navy via-navy/70 to-transparent md:hidden" />
        </div>
        <div className="pointer-events-none absolute -top-2 -left-2 hidden size-9 border-t-[1.5px] border-l-[1.5px] border-gold md:block" />
        <div className="pointer-events-none absolute -right-2 -bottom-2 hidden size-9 border-r-[1.5px] border-b-[1.5px] border-gold md:block" />
      </div>
      <div className="relative z-10 -mt-28 px-7 pb-12 md:order-1 md:mt-0 md:px-0 md:pb-0">
        <h1>
          <span className="block font-sans text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
            Avocate en droit de la famille à Paris
          </span>
          <span className="mt-3.5 block font-serif text-5xl leading-[1.02] font-medium text-white sm:text-6xl md:text-7xl">
            Charline HAYS
          </span>
        </h1>
        <p className="mt-4.5 max-w-[30ch] font-serif text-xl leading-snug text-[#d5dcea] md:text-[23px]">
          Divorce, enfants, patrimoine : un accompagnement humain et rigoureux.
        </p>
        <div className="mt-5.5 h-0.5 w-14 bg-gold" />
        <SituationPicker />
      </div>
    </div>
  </header>
);
