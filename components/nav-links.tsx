"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";

export const NavLinks = () => {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries
          .filter(({ isIntersecting }) => isIntersecting)
          .forEach(({ target }) => setActiveHref(`/#${target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hidden items-center gap-6.5 lg:flex">
      {NAV_LINKS.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          aria-current={activeHref === href ? "location" : undefined}
          className="group relative py-1.5 text-sm text-ink transition-colors hover:text-navy aria-[current]:text-navy"
        >
          {label}
          <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-aria-[current]:scale-x-100" />
        </a>
      ))}
    </div>
  );
};
