"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, LoaderCircle } from "lucide-react";
import {
  disablePush,
  enablePush,
  readPushState,
  type PushState,
} from "@/lib/push-client";
import type { Toast } from "@/components/admin/admin-toast";

interface NotificationsToggleProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

const LABELS: Record<PushState, string> = {
  on: "Notifications activées",
  off: "Activer les notifications",
  denied: "Notifications bloquées",
  "needs-install": "Installer l'app pour les notifications",
  unsupported: "Notifications indisponibles",
};

export const NotificationsToggle = ({ notify }: NotificationsToggleProps) => {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    readPushState()
      .then(setState)
      .catch(() => setState("unsupported"));
  }, []);

  if (!state || state === "unsupported") return null;

  const toggle = async () => {
    if (state === "denied") {
      notify(
        "warning",
        "Autorisez les notifications dans les réglages du navigateur",
      );
      return;
    }
    if (state === "needs-install") {
      notify(
        "warning",
        "Partager puis « Sur l'écran d'accueil », et ouvrez l'app installée",
      );
      return;
    }
    setBusy(true);
    try {
      const next = state === "on" ? await disablePush() : await enablePush();
      setState(next);
      if (next === "on") notify("success", "Notifications activées");
      if (next === "off" && state === "on") {
        notify("success", "Notifications désactivées");
      }
      if (next === "denied") {
        notify("warning", "Notifications refusées par le navigateur");
      }
    } catch {
      notify("error", "Activation impossible, réessayez");
    } finally {
      setBusy(false);
    }
  };

  const Icon = state === "on" ? BellRing : state === "denied" ? BellOff : Bell;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={state === "on"}
      aria-label={LABELS[state]}
      title={LABELS[state]}
      className={`relative grid size-10 cursor-pointer place-items-center transition-colors ${
        state === "on" ? "text-gold-soft" : "text-mist hover:text-white"
      }`}
    >
      {busy ? (
        <LoaderCircle className="size-4.5 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="size-4.5" aria-hidden="true" />
      )}
      {state === "off" || state === "needs-install" ? (
        <span className="absolute top-2 right-2 size-2 rounded-full bg-gold" />
      ) : null}
    </button>
  );
};
