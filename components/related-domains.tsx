import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DOMAIN_PAGES } from "@/lib/content";

interface RelatedDomainsProps {
  currentSlug?: string;
}

export const RelatedDomains = ({ currentSlug }: RelatedDomainsProps) => (
  <ul className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
    {DOMAIN_PAGES.filter(({ slug }) => slug !== currentSlug).map(
      ({ slug, title }) => (
        <li key={slug} className="border-b border-line">
          <Link
            href={`/domaines/${slug}`}
            className="group flex min-h-14 items-center justify-between gap-3 py-3 font-serif text-lg text-navy transition-colors hover:text-gold"
          >
            {title}
            <ArrowRight
              className="size-4.5 shrink-0 text-gold transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </li>
      ),
    )}
  </ul>
);
