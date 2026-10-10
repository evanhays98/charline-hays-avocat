import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

export const SiteFooter = () => (
  <footer className="bg-navy-deep text-mist">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-7 pt-7 pb-27 text-[13px] sm:pb-7">
      <span className="flex items-center gap-3 font-serif text-[15px] text-[#dde3ef]">
        <LogoMark className="h-6 w-6" ringClassName="stroke-gold-soft" />
        Charline HAYS — Avocate au Barreau de Paris
      </span>
      <div className="flex gap-6">
        <Link
          href="/mentions-legales"
          className="transition-colors hover:text-white"
        >
          Mentions légales
        </Link>
        <Link
          href="/politique-de-confidentialite"
          className="transition-colors hover:text-white"
        >
          Politique de confidentialité
        </Link>
      </div>
    </div>
  </footer>
);
