import { supabase } from "@/lib/supabase";

export type PushState =
  "unsupported" | "needs-install" | "denied" | "off" | "on";

const SERVICE_WORKER_URL = "/admin-sw.js";
const SCOPE = "/admin";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ("standalone" in navigator && navigator.standalone === true);

const base64UrlToBytes = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

export const registerAdminWorker = () =>
  "serviceWorker" in navigator
    ? navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: SCOPE })
    : Promise.resolve(null);

const pushSupported = () =>
  Boolean(vapidPublicKey) &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export const readPushState = async (): Promise<PushState> => {
  if (isIos() && !isStandalone()) return "needs-install";
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const registration = await registerAdminWorker();
  const subscription = await registration?.pushManager.getSubscription();
  return subscription ? "on" : "off";
};

const keyOf = (subscription: PushSubscription, name: PushEncryptionKeyName) => {
  const key = subscription.getKey(name);
  if (!key) return "";
  return btoa(String.fromCharCode(...new Uint8Array(key)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const enablePush = async (): Promise<PushState> => {
  if (!supabase || !vapidPublicKey || !pushSupported()) return "unsupported";
  const permission = await Notification.requestPermission();
  if (permission !== "granted")
    return permission === "denied" ? "denied" : "off";
  const registration = await registerAdminWorker();
  if (!registration) return "unsupported";
  await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToBytes(vapidPublicKey),
    }));
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh: keyOf(subscription, "p256dh"),
      auth: keyOf(subscription, "auth"),
    },
    { onConflict: "endpoint" },
  );
  if (error) throw error;
  return "on";
};

export const disablePush = async (): Promise<PushState> => {
  const registration = await registerAdminWorker();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return "off";
  await supabase
    ?.from("push_subscriptions")
    .delete()
    .eq("endpoint", subscription.endpoint);
  await subscription.unsubscribe();
  return "off";
};
