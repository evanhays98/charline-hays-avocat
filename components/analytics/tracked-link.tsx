"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/track";

interface TrackedLinkProps {
  href: string;
  event: string;
  properties?: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
}

export const TrackedLink = ({
  href,
  event,
  properties,
  className,
  children,
}: TrackedLinkProps) => (
  <a
    href={href}
    className={className}
    onClick={() => trackEvent(event, properties)}
  >
    {children}
  </a>
);
