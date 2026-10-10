"use client";

import { Download } from "lucide-react";
import { promptInstall, useInstallAvailable } from "@/lib/install-prompt";

interface InstallAppButtonProps {
  tone?: "dark" | "light";
  compact?: boolean;
}

const TONES = {
  dark: "border-white/25 text-paper hover:border-gold-soft hover:text-gold-soft",
  light: "border-line text-navy hover:border-navy",
};

export const InstallAppButton = ({
  tone = "dark",
  compact = false,
}: InstallAppButtonProps) => {
  const available = useInstallAvailable();
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => promptInstall()}
      className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 border px-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${TONES[tone]}`}
    >
      <Download className="size-3.5" aria-hidden="true" />
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
        Installer l&apos;app
      </span>
    </button>
  );
};
