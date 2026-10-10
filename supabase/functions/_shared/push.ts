import * as webpush from "jsr:@negrel/webpush@0.5.0";
import { CONFIG } from "./config.ts";
import { serviceClient } from "./clients.ts";

export interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

interface StoredSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

const applicationServer = async (exportedKeys: string) =>
  await webpush.ApplicationServer.new({
    contactInformation: CONFIG.vapidSubject,
    vapidKeys: await webpush.importVapidKeys(JSON.parse(exportedKeys)),
  });

export const notifyAdmins = async (payload: PushPayload) => {
  if (!CONFIG.vapidKeys) return 0;
  const supabase = serviceClient();
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .returns<StoredSubscription[]>();
  if (error || !subscriptions || subscriptions.length === 0) return 0;

  const server = await applicationServer(CONFIG.vapidKeys);
  const results = await Promise.all(
    subscriptions.map(async ({ id, endpoint, p256dh, auth }) => {
      try {
        await server
          .subscribe({ endpoint, keys: { p256dh, auth } })
          .pushTextMessage(JSON.stringify(payload), {
            ttl: 86400,
            urgency: webpush.Urgency.High,
          });
        return { id, delivered: true, gone: false };
      } catch (pushError) {
        const gone = pushError instanceof webpush.PushMessageError &&
          pushError.isGone();
        console.error(`Push ${gone ? "expiré" : "échoué"} : ${pushError}`);
        return { id, delivered: false, gone };
      }
    }),
  );

  const goneIds = results.filter(({ gone }) => gone).map(({ id }) => id);
  if (goneIds.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", goneIds);
  }
  return results.filter(({ delivered }) => delivered).length;
};
