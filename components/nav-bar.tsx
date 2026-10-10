import { CalendarDays, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { LogoMark } from "@/components/logo-mark";
import { NavLinks } from "@/components/nav-links";
import { TrackedLink } from "@/components/analytics/tracked-link";

export const NavBar = () => (
  <nav className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-7">
      <a
        href="#haut"
        className="flex items-center gap-3 font-serif text-xl tracking-wide text-navy"
      >
        <LogoMark className="h-8 w-8" />
        Charline HAYS
      </a>
      <NavLinks />
      <TrackedLink
        href="#contact"
        event="rdv_cta_clic"
        properties={{ emplacement: "nav" }}
        className="hidden items-center gap-2 bg-navy px-4.5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-navy-deep sm:inline-flex"
      >
        <CalendarDays className="size-3.5" aria-hidden="true" />
        Prendre rendez-vous
      </TrackedLink>
      <TrackedLink
        href={CONTACT.phoneHref}
        event="appel_clic"
        properties={{ emplacement: "nav" }}
        className="grid size-11 place-items-center border border-line text-navy transition-colors hover:border-navy sm:hidden"
      >
        <Phone className="size-4.5" aria-label="Appeler" />
      </TrackedLink>
    </div>
  </nav>
);
