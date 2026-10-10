import { serviceClient, userClient } from "../_shared/clients.ts";
import { responder } from "../_shared/http.ts";
import { type EmailMessage, sendEmail } from "../_shared/mailer.ts";
import {
  cancelledEmail,
  declinedEmail,
  DEFAULT_MESSAGES,
  scheduledEmail,
} from "../_shared/emails.ts";
import {
  type Booking,
  type ConsultationFormat,
  isConsultationFormat,
  isScheduled,
  isSubject,
} from "../_shared/booking.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EXCLUSION_VIOLATION = "23P01";

interface NewClient {
  fullName: string;
  email: string | null;
  phone: string | null;
  subject: string;
}

type AdminCommand =
  | {
    action: "schedule";
    bookingId: string;
    startsAt: string;
    format: ConsultationFormat | null;
  }
  | {
    action: "create";
    client: NewClient;
    startsAt: string;
    format: ConsultationFormat;
  }
  | { action: "decline"; bookingId: string }
  | { action: "cancel"; bookingId: string };

type Body = Record<string, unknown>;

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isoInstant = (value: unknown) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? new Date(value).toISOString()
    : null;

const bookingIdOf = (body: Body) =>
  typeof body.bookingId === "string" && UUID_PATTERN.test(body.bookingId)
    ? body.bookingId
    : null;

const parseClient = (value: unknown): NewClient | null => {
  if (!value || typeof value !== "object") return null;
  const client: Body = { ...value };
  const fullName = text(client.fullName, 120);
  const email = text(client.email, 254).toLowerCase();
  if (fullName.length < 2 || !isSubject(client.subject)) return null;
  if (email && !EMAIL_PATTERN.test(email)) return null;
  return {
    fullName,
    email: email || null,
    phone: text(client.phone, 30) || null,
    subject: client.subject,
  };
};

const parseCommand = (body: Body): AdminCommand | null => {
  const bookingId = bookingIdOf(body);
  const startsAt = isoInstant(body.startsAt);
  const format = isConsultationFormat(body.format) ? body.format : null;
  if (body.action === "decline" && bookingId) {
    return { action: "decline", bookingId };
  }
  if (body.action === "cancel" && bookingId) {
    return { action: "cancel", bookingId };
  }
  if (body.action === "schedule" && bookingId && startsAt) {
    return { action: "schedule", bookingId, startsAt, format };
  }
  const client = parseClient(body.client);
  if (body.action === "create" && client && startsAt && format) {
    return { action: "create", client, startsAt, format };
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

const endOf = async (startsAt: string) =>
  new Date(new Date(startsAt).getTime() + (await slotMinutes()) * 60_000)
    .toISOString();

const loadBooking = async (bookingId: string) => {
  const { data } = await serviceClient()
    .from("bookings")
    .select()
    .eq("id", bookingId)
    .maybeSingle<Booking>();
  return data;
};

const projectedBooking = async (
  command: AdminCommand,
  before: Booking | null,
): Promise<Booking | null> => {
  if (command.action === "create") {
    return {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      starts_at: command.startsAt,
      ends_at: await endOf(command.startsAt),
      status: "confirmed",
      subject: command.client.subject,
      format: command.format,
      full_name: command.client.fullName,
      email: command.client.email,
      phone: command.client.phone,
      message: null,
      availability: [],
    };
  }
  if (!before) return null;
  if (command.action === "schedule") {
    return {
      ...before,
      status: "confirmed",
      starts_at: command.startsAt,
      ends_at: await endOf(command.startsAt),
      format: command.format ?? before.format,
    };
  }
  return {
    ...before,
    status: command.action === "decline" ? "declined" : "cancelled",
  };
};

const defaultMessageFor = (command: AdminCommand, before: Booking | null) => {
  if (command.action === "decline") return DEFAULT_MESSAGES.declined;
  if (command.action === "cancel") return DEFAULT_MESSAGES.cancelled;
  return before?.status === "confirmed"
    ? DEFAULT_MESSAGES.rescheduled
    : DEFAULT_MESSAGES.scheduled;
};

const emailFor = (
  command: AdminCommand,
  booking: Booking,
  before: Booking | null,
  message: string | undefined,
): EmailMessage | null => {
  if (command.action === "decline") return declinedEmail(booking, message);
  if (!isScheduled(booking)) return null;
  if (command.action === "cancel") return cancelledEmail(booking, message);
  return scheduledEmail(booking, before?.status === "confirmed", message);
};

const persist = async (
  command: AdminCommand,
  projected: Booking,
) => {
  const bookings = serviceClient().from("bookings");
  if (command.action === "create") {
    return await bookings
      .insert({
        starts_at: projected.starts_at,
        ends_at: projected.ends_at,
        status: projected.status,
        subject: projected.subject,
        format: projected.format,
        full_name: projected.full_name,
        email: projected.email,
        phone: projected.phone,
        availability: projected.availability,
      }).select().maybeSingle<Booking>();
  }
  const allowed = command.action === "schedule"
    ? ["pending", "confirmed"]
    : command.action === "decline"
    ? ["pending"]
    : ["confirmed"];
  return await bookings
    .update({
      status: projected.status,
      starts_at: projected.starts_at,
      ends_at: projected.ends_at,
      format: projected.format,
    })
    .eq("id", command.bookingId)
    .in("status", allowed)
    .select()
    .maybeSingle<Booking>();
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

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ error: "invalid_request" }, 400);
  }
  const input: Body = { ...body };
  const command = parseCommand(input);
  if (!command) return json({ error: "invalid_request" }, 400);

  const before = command.action === "create"
    ? null
    : await loadBooking(command.bookingId);
  if (command.action !== "create" && !before) {
    return json({ error: "not_found" }, 404);
  }

  const projected = await projectedBooking(command, before);
  if (!projected) return json({ error: "not_found" }, 404);
  const customMessage = text(input.message, 4000);
  const message = customMessage || undefined;

  if (input.preview === true) {
    const email = emailFor(command, projected, before, message);
    return json({
      defaultMessage: defaultMessageFor(command, before),
      email: email
        ? { to: email.to.email, subject: email.subject, html: email.html }
        : null,
    });
  }

  const { data: booking, error } = await persist(command, projected);
  if (error?.code === EXCLUSION_VIOLATION) {
    return json({ error: "slot_taken" }, 409);
  }
  if (error) {
    console.error(error);
    return json({ error: "server_error" }, 500);
  }
  if (!booking) return json({ error: "invalid_transition" }, 409);

  const email = input.notify === false
    ? null
    : emailFor(command, booking, before, message);
  const emailSent = email ? await sendEmail(email) : false;

  return json({ booking, emailSent });
});
