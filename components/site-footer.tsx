import Link from "next/link";
import { CONTACT, DOMAIN_PAGES } from "@/lib/content";
import { LogoMark } from "@/components/logo-mark";

const linkClass = "transition-colors hover:text-white";

export const SiteFooter = () => (
  <footer className="bg-navy-deep text-mist">
    <div className="mx-auto grid max-w-5xl gap-8 px-7 pt-12 pb-8 text-[13.5px] md:grid-cols-[1.2fr_1fr_1fr]">
      <div>
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-[16px] text-[#dde3ef]"
        >
          <LogoMark className="h-7 w-7" ringClassName="stroke-gold-soft" />
          Charline HAYS — Avocate
        </Link>
        <address className="mt-4 leading-relaxed not-italic">
          Avocate au Barreau de Paris
          <br />
          {CONTACT.address}
          <br />
          <a href={CONTACT.phoneHref} className={linkClass}>
            {CONTACT.phone}
          </a>
        </address>
      </div>
      <nav aria-label="Domaines d'intervention">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-soft">
          Domaines d&apos;intervention
        </p>
        <ul className="grid gap-1.5">
          {DOMAIN_PAGES.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/domaines/${slug}`} className={linkClass}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Informations">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-soft">
          Cabinet
        </p>
        <ul className="grid gap-1.5">
          <li>
            <Link href="/a-propos" className={linkClass}>
              À propos
            </Link>
          </li>
          <li>
            <Link href="/#contact" className={linkClass}>
              Prendre rendez-vous
            </Link>
          </li>
          <li>
            <Link href="/mentions-legales" className={linkClass}>
              Mentions légales
            </Link>
          </li>
          <li>
            <Link href="/politique-de-confidentialite" className={linkClass}>
              Politique de confidentialité
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div className="border-t border-white/10">
      <p className="mx-auto max-w-5xl px-7 pt-5 pb-27 text-xs text-mist/70 sm:pb-5">
        © {new Date().getFullYear()} Charline HAYS — Avocate au Barreau de Paris
      </p>
    </div>
  </footer>
);
