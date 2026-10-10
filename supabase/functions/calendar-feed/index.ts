import { serviceClient } from "../_shared/clients.ts";
import { CONFIG } from "../_shared/config.ts";
import {
  FORMAT_LABELS,
  type ScheduledBooking,
  SUBJECT_LABELS,
} from "../_shared/booking.ts";
import { escapeText, joinIcs, toIcsDate } from "../_shared/ics.ts";

const HISTORY_DAYS = 90;

const constantTimeEquals = (left: string, right: string) => {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  return a.reduce((diff, byte, index) => diff | (byte ^ b[index]), 0) === 0;
};

const locationOf = (booking: ScheduledBooking) =>
  booking.format === "cabinet"
    ? CONFIG.officeAddress
    : FORMAT_LABELS[booking.format];

const eventLines = (booking: ScheduledBooking, stamp: string) => [
  "BEGIN:VEVENT",
  `UID:${booking.id}@haysavocat.fr`,
  `DTSTAMP:${stamp}`,
  `DTSTART:${toIcsDate(booking.starts_at)}`,
  `DTEND:${toIcsDate(booking.ends_at)}`,
  `SUMMARY:${
    escapeText(
      `RDV · ${booking.full_name} — ${
        SUBJECT_LABELS[booking.subject] ?? booking.subject
      }`,
    )
  }`,
  `LOCATION:${escapeText(locationOf(booking))}`,
  `DESCRIPTION:${
    escapeText(
      [
        FORMAT_LABELS[booking.format],
        booking.phone ? `Tél. ${booking.phone}` : null,
        booking.email,
        `${CONFIG.siteUrl}/admin`,
      ].filter(Boolean).join("\n"),
    )
  }`,
  "STATUS:CONFIRMED",
  "TRANSP:OPAQUE",
  "BEGIN:VALARM",
  "ACTION:DISPLAY",
  `DESCRIPTION:${escapeText(`RDV ${booking.full_name}`)}`,
  "TRIGGER:-PT30M",
  "END:VALARM",
  "END:VEVENT",
];

Deno.serve(async (request) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const supabase = serviceClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("calendar_token")
    .single<{ calendar_token: string }>();
  if (
    !settings || !token || !constantTimeEquals(token, settings.calendar_token)
  ) {
    return new Response("Not found", { status: 404 });
  }

  const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000)
    .toISOString();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select()
    .eq("status", "confirmed")
    .gte("starts_at", since)
    .order("starts_at")
    .returns<ScheduledBooking[]>();
  if (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }

  const stamp = toIcsDate(new Date().toISOString());
  const body = joinIcs([
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//haysavocat.fr//Agenda des rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Rendez-vous cabinet",
    "X-WR-TIMEZONE:Europe/Paris",
    "REFRESH-INTERVAL;VALUE=DURATION:PT15M",
    "X-PUBLISHED-TTL:PT15M",
    ...(bookings ?? []).flatMap((booking) => eventLines(booking, stamp)),
    "END:VCALENDAR",
  ]);

  return new Response(request.method === "HEAD" ? null : body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="rendez-vous.ics"',
      "Cache-Control": "no-store",
    },
  });
});
