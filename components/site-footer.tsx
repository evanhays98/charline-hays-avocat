import Link from "next/link";

export const SiteFooter = () => (
  <footer className="bg-navy-deep text-mist">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-7 py-7 text-[13px]">
      <span className="font-serif text-[15px] text-[#dde3ef]">
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
