import { serviceClient, userClient } from "../_shared/clients.ts";
import { responder } from "../_shared/http.ts";
import { sendEmail } from "../_shared/mailer.ts";
import {
  cancelledEmail,
  declinedEmail,
  scheduledEmail,
} from "../_shared/emails.ts";
import { type Booking, isScheduled } from "../_shared/booking.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EXCLUSION_VIOLATION = "23P01";

type AdminCommand =
  | { action: "schedule"; startsAt: string }
  | { action: "decline" }
  | { action: "cancel" };

const parseCommand = (body: Record<string, unknown>): AdminCommand | null => {
  if (body.action === "decline") return { action: "decline" };
  if (body.action === "cancel") return { action: "cancel" };
  if (
    body.action === "schedule" && typeof body.startsAt === "string" &&
    !Number.isNaN(Date.parse(body.startsAt))
  ) {
    return {
      action: "schedule",
      startsAt: new Date(body.startsAt).toISOString(),
    };
  }
  return null;
};

const slotMinutes = async () => {
  const { data } = await serviceClient()
    .from("settings")
    .select("slot_minutes")
    .single<{ slot_minutes: number }>();
  return data?.slot_minutes ?? 60;
};

const applyCommand = async (bookingId: string, command: AdminCommand) => {
  const bookings = serviceClient().from("bookings");
  if (command.action === "schedule") {
    const minutes = await slotMinutes();
    const endsAt = new Date(
      new Date(command.startsAt).getTime() + minutes * 60 * 1000,
    ).toISOString();
    return await bookings
      .update({
        status: "confirmed",
        starts_at: command.startsAt,
        ends_at: endsAt,
      })
      .eq("id", bookingId)
      .in("status", ["pending", "confirmed"])
      .select()
      .maybeSingle<Booking>();
  }
  return await bookings
    .update({ status: command.action === "decline" ? "declined" : "cancelled" })
    .eq("id", bookingId)
    .in("status", command.action === "decline" ? ["pending"] : ["confirmed"])
    .select()
    .maybeSingle<Booking>();
};

const emailFor = (command: AdminCommand, booking: Booking, before: Booking) => {
  if (command.action === "decline") return declinedEmail(booking);
  if (!isScheduled(booking)) return null;
  if (command.action === "cancel") return cancelledEmail(booking);
  return scheduledEmail(booking, before.status === "confirmed");
};

Deno.serve(async (request) => {
  const { json, preflight } = responder(request);
  const early = preflight();
  if (early) return early;
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization) return json({ error: "unauthorized" }, 401);
  const { data: isAdmin, error: authError } = await userClient(authorization)
    .rpc("is_admin");
  if (authError || isAdmin !== true) return json({ error: "forbidden" }, 403);

  const body = await request.json().catch(() => null);
  const command = body && typeof body === "object" ? parseCommand(body) : null;
  const bookingId = body?.bookingId;
  if (
    !command || typeof bookingId !== "string" || !UUID_PATTERN.test(bookingId)
  ) {
    return json({ error: "invalid_request" }, 400);
  }

  const { data: before } = await serviceClient()
    .from("bookings")
    .select()
    .eq("id", bookingId)
    .maybeSingle<Booking>();
  if (!before) return json({ error: "not_found" }, 404);

  const { data: booking, error } = await applyCommand(bookingId, command);
  if (error?.code === EXCLUSION_VIOLATION) {
    return json({ error: "slot_taken" }, 409);
  }
  if (error) {
    console.error(error);
    return json({ error: "server_error" }, 500);
  }
  if (!booking) return json({ error: "invalid_transition" }, 409);

  const message = body?.notify === false
    ? null
    : emailFor(command, booking, before);
  const emailSent = message ? await sendEmail(message) : false;

  return json({ booking, emailSent });
});
