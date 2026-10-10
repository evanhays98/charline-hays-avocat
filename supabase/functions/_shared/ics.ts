import { CONFIG } from "./config.ts";
import {
  FORMAT_LABELS,
  type ScheduledBooking,
  SUBJECT_LABELS,
} from "./booking.ts";

const TITLE = "Rendez-vous — Maître Charline HAYS";

export const toIcsDate = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const encoder = new TextEncoder();

const splitAtOctets = (line: string, limit: number): string[] => {
  const chars = Array.from(line);
  const chunk = chars.reduce(
    (state, char) => {
      if (state.done) return state;
      const size = encoder.encode(char).length;
      if (state.bytes + size > limit) return { ...state, done: true };
      return {
        text: state.text + char,
        bytes: state.bytes + size,
        done: false,
      };
    },
    { text: "", bytes: 0, done: false },
  ).text;
  const rest = line.slice(chunk.length);
  return rest.length === 0 ? [chunk] : [chunk, ...splitAtOctets(rest, 74)];
};

export const foldLine = (line: string) => splitAtOctets(line, 75).join("\r\n ");

export const joinIcs = (lines: string[]) =>
  `${lines.map(foldLine).join("\r\n")}\r\n`;

const toBase64 = (text: string) =>
  btoa(
    Array.from(
      new TextEncoder().encode(text),
      (byte) => String.fromCharCode(byte),
    ).join(""),
  );

const locationOf = (booking: ScheduledBooking) =>
  booking.format === "cabinet"
    ? CONFIG.officeAddress
    : FORMAT_LABELS[booking.format];

const descriptionOf = (booking: ScheduledBooking) =>
  `${SUBJECT_LABELS[booking.subject] ?? booking.subject} · ${
    FORMAT_LABELS[booking.format]
  }\nContact : ${CONFIG.officePhone}`;

export const buildIcsAttachment = (booking: ScheduledBooking) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//haysavocat.fr//Rendez-vous//FR",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@haysavocat.fr`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(booking.starts_at)}`,
    `DTEND:${toIcsDate(booking.ends_at)}`,
    `SUMMARY:${escapeText(TITLE)}`,
    `LOCATION:${escapeText(locationOf(booking))}`,
    `DESCRIPTION:${escapeText(descriptionOf(booking))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return { name: "rendez-vous.ics", content: toBase64(joinIcs(lines)) };
};

export const googleCalendarUrl = (booking: ScheduledBooking) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${toIcsDate(booking.starts_at)}/${toIcsDate(booking.ends_at)}`,
    location: locationOf(booking),
    details: descriptionOf(booking),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
