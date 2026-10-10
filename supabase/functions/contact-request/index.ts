import { serviceClient } from "../_shared/clients.ts";
import { responder } from "../_shared/http.ts";
import { sendEmail } from "../_shared/mailer.ts";
import { newRequestEmail, requestReceivedEmail } from "../_shared/emails.ts";
import { notifyAdmins } from "../_shared/push.ts";
import {
  AVAILABILITY_PATTERN,
  type Booking,
  type ConsultationFormat,
  FORMAT_LABELS,
  isConsultationFormat,
  isSubject,
  SUBJECT_LABELS,
} from "../_shared/booking.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PENDING_PER_EMAIL = 2;
const MAX_AVAILABILITY = 30;
const AVAILABILITY_WINDOW_DAYS = 90;

interface ContactRequest {
  subject: string;
  format: ConsultationFormat;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  availability: string[];
  website: string;
}

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

const parseAvailability = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  const now = Date.now();
  const earliest = isoDay(new Date(now - 24 * 60 * 60 * 1000));
  const latest = isoDay(
    new Date(now + AVAILABILITY_WINDOW_DAYS * 24 * 60 * 60 * 1000),
  );
  return [
    ...new Set(
      value.filter((item): item is string =>
        typeof item === "string" && AVAILABILITY_PATTERN.test(item) &&
        item.slice(0, 10) >= earliest && item.slice(0, 10) <= latest
      ),
    ),
  ].slice(0, MAX_AVAILABILITY);
};

const parseRequest = (body: Record<string, unknown>): ContactRequest | null => {
  const fullName = text(body.fullName, 120);
  const email = text(body.email, 254).toLowerCase();
  if (
    !isSubject(body.subject) ||
    !isConsultationFormat(body.format) ||
    fullName.length < 2 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return null;
  }
  return {
    subject: body.subject,
    format: body.format,
    fullName,
    email,
    phone: text(body.phone, 30) || null,
    message: text(body.message, 1000) || null,
    availability: parseAvailability(body.availability),
    website: text(body.website, 200),
  };
};

Deno.serve(async (request) => {
  const { json, preflight } = responder(request);
  const early = preflight();
  if (early) return early;
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const body = await request.json().catch(() => null);
  const input = body && typeof body === "object" ? parseRequest(body) : null;
  if (!input) return json({ error: "invalid_request" }, 400);
  if (input.website) return json({ request: null }, 201);

  const supabase = serviceClient();
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("email", input.email)
    .eq("status", "pending");
  if ((count ?? 0) >= MAX_PENDING_PER_EMAIL) {
    return json({ error: "too_many_requests" }, 429);
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      subject: input.subject,
      format: input.format,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      message: input.message,
      availability: input.availability,
    })
    .select()
    .single<Booking>();
  if (error || !booking) {
    console.error(error);
    return json({ error: "server_error" }, 500);
  }

  await Promise.all([
    sendEmail(requestReceivedEmail(booking)),
    sendEmail(newRequestEmail(booking)),
    notifyAdmins({
      title: `Nouvelle demande · ${booking.full_name}`,
      body: `${SUBJECT_LABELS[booking.subject] ?? booking.subject} · ${
        FORMAT_LABELS[booking.format]
      }`,
      url: "/admin",
      tag: booking.id,
    }),
  ]);

  return json({ request: { id: booking.id } }, 201);
});
