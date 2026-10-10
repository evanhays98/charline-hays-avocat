import { useSyncExternalStore } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let pending: InstallPromptEvent | null = null;
let listening = false;

const isInstallPrompt = (event: Event): event is InstallPromptEvent =>
  "prompt" in event && typeof event.prompt === "function";

const publish = (event: InstallPromptEvent | null) => {
  pending = event;
  listeners.forEach((listener) => listener());
};

export const listenForInstallPrompt = () => {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    if (!isInstallPrompt(event)) return;
    event.preventDefault();
    publish(event);
  });
  window.addEventListener("appinstalled", () => publish(null));
};

export const promptInstall = async () => {
  if (!pending) return;
  await pending.prompt();
  publish(null);
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useInstallAvailable = () =>
  useSyncExternalStore(
    subscribe,
    () => pending !== null,
    () => false,
  );

listenForInstallPrompt();
