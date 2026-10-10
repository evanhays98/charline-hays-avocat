import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Fil d'Ariane">
    <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-mist">
      {items.map(({ label, href }, index) => (
        <li key={label} className="flex items-center gap-1.5">
          {index > 0 ? (
            <ChevronRight
              className="size-3.5 text-mist/60"
              aria-hidden="true"
            />
          ) : null}
          {href ? (
            <Link href={href} className="transition-colors hover:text-white">
              {label}
            </Link>
          ) : (
            <span aria-current="page" className="text-[#dde3ef]">
              {label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
