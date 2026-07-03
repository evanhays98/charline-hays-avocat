import { NAV_LINKS } from "@/lib/content";
import { TrackedLink } from "@/components/analytics/tracked-link";

export const NavBar = () => (
  <nav className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-7">
      <a href="#haut" className="font-serif text-xl tracking-wide text-navy">
        Charline Hays
      </a>
      <div className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="hidden text-sm text-ink transition-colors hover:text-gold lg:block"
          >
            {label}
          </a>
        ))}
        <TrackedLink
          href="#contact"
          event="rdv_cta_clic"
          properties={{ emplacement: "nav" }}
          className="bg-navy px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-navy-deep"
        >
          Prendre rendez-vous
        </TrackedLink>
      </div>
    </div>
  </nav>
);
