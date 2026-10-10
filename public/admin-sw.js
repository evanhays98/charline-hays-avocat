const DEFAULT_URL = "/admin";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const readPayload = (event) => {
  try {
    return event.data ? event.data.json() : {};
  } catch {
    return { body: event.data ? event.data.text() : "" };
  }
};

self.addEventListener("push", (event) => {
  const payload = readPayload(event);
  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Nouvelle demande", {
      body: payload.body ?? "",
      tag: payload.tag,
      icon: "/admin-icon-192.png",
      badge: "/admin-icon-192.png",
      lang: "fr",
      data: { url: payload.url ?? DEFAULT_URL },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url ?? DEFAULT_URL, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => client.url.startsWith(`${self.location.origin}/admin`));
      if (existing) return existing.navigate(target).then((client) => (client ?? existing).focus());
      return self.clients.openWindow(target);
    }),
  );
});
