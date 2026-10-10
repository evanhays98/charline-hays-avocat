"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

const isTracked = (pathname: string) => !pathname.startsWith("/admin");

export const PostHogInit = () => {
  const pathname = usePathname();
  const tracked = isTracked(pathname);

  useEffect(() => {
    if (!KEY || !tracked) return;
    posthog.init(KEY, {
      api_host: HOST,
      ui_host: "https://eu.posthog.com",
      persistence: "memory",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: true,
      respect_dnt: true,
    });
  }, [tracked]);

  useEffect(() => {
    if (!KEY || !tracked) return;
    posthog.capture("$pageview");
  }, [pathname, tracked]);

  return null;
};
