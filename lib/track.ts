import posthog from "posthog-js";

type EventProperties = Record<string, string | number | boolean>;

const enabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export const trackEvent = (event: string, properties?: EventProperties) => {
  if (!enabled || typeof window === "undefined") return;
  posthog.capture(event, properties);
};
