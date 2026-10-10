"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const isInstallPrompt = (event: Event): event is InstallPromptEvent =>
  "prompt" in event && typeof event.prompt === "function";

export const InstallAppButton = () => {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const capture = (event: Event) => {
      if (!isInstallPrompt(event)) return;
      event.preventDefault();
      setPromptEvent(event);
    };
    const clear = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", clear);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", clear);
    };
  }, []);

  if (!promptEvent) return null;

  return (
    <button
      type="button"
      onClick={() => promptEvent.prompt().then(() => setPromptEvent(null))}
      className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-white/25 px-3 text-xs font-bold uppercase tracking-[0.12em] text-paper transition-colors hover:border-gold-soft hover:text-gold-soft"
    >
      <Download className="size-3.5" aria-hidden="true" />
      Installer
    </button>
  );
};
