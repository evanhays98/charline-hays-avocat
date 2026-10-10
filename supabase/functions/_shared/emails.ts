import { CONFIG, LOGO_URL, MAPS_URL } from "./config.ts";
import {
  type Booking,
  FORMAT_LABELS,
  type ScheduledBooking,
  SUBJECT_LABELS,
} from "./booking.ts";
import { dateParts, formatAvailability, formatDateTime } from "./dates.ts";
import { buildIcsAttachment, googleCalendarUrl } from "./ics.ts";
import type { EmailMessage } from "./mailer.ts";

const COLORS = {
  navy: "#13264b",
  paper: "#fbfaf6",
  ink: "#212a3e",
  body: "#3a4256",
  soft: "#4a5266",
  gold: "#a8862f",
  goldSoft: "#c9ae6b",
  line: "#e5e2d9",
  background: "#f4f2ec",
  quote: "#f7f4ec",
  green: "#2f6f51",
  grey: "#6b7280",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

type CardTone = "navy" | "green" | "grey";

const TONE_COLORS: Record<CardTone, string> = {
  navy: COLORS.navy,
  green: COLORS.green,
  grey: COLORS.grey,
};

const TONE_DIVIDERS: Record<CardTone, string> = {
  navy: "#4a5a7a",
  green: "#5f8f78",
  grey: "#8f949d",
};

interface Button {
  href: string;
  label: string;
  outline?: boolean;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const subjectOf = (booking: Booking) =>
  escapeHtml(SUBJECT_LABELS[booking.subject] ?? booking.subject);

const firstName = (booking: Booking) =>
  escapeHtml(booking.full_name.trim().split(/\s+/)[0] ?? booking.full_name);

const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const officePhoneHref = phoneHref(`+33${CONFIG.officePhone.slice(1)}`);

const paragraph = (html: string) =>
  `<p style="margin:0 0 14px;font:16px/1.6 ${SANS};color:${COLORS.ink}">${html}</p>`;

const heading = (text: string) => `
<p style="margin:0;font:400 23px/1.3 ${SERIF};color:${COLORS.navy}">${text}</p>
<div style="width:40px;height:2px;background:${COLORS.gold};margin:12px 0 18px;font-size:0;line-height:0">&nbsp;</div>`;

const label = (text: string) =>
  `<p style="margin:0 0 3px;font:700 10px/1.4 ${SANS};letter-spacing:1.6px;text-transform:uppercase;color:${COLORS.gold}">${text}</p>`;

const buttons = (items: Button[]) =>
  items.map(({ href, label: text, outline }) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px">
  <tr><td align="center" style="${
    outline ? `border:1px solid ${COLORS.navy};` : `background:${COLORS.navy};`
  }">
    <a href="${href}" style="display:block;padding:15px 16px;font:700 12px/1.2 ${SANS};letter-spacing:1.6px;text-transform:uppercase;text-decoration:none;color:${
    outline ? COLORS.navy : "#ffffff"
  }">${text}</a>
  </td></tr>
</table>`).join("");

const dateCard = (booking: ScheduledBooking, tone: CardTone) => {
  const { weekday, day, month, time } = dateParts(booking.starts_at);
  const struck = tone === "grey" ? "text-decoration:line-through;" : "";
  const venue = booking.format === "cabinet"
    ? escapeHtml(CONFIG.officeAddress)
    : FORMAT_LABELS[booking.format];
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${COLORS.line};background:#ffffff">
  <tr>
    <td width="88" valign="middle" align="center" style="width:88px;background:${
    TONE_COLORS[tone]
  };padding:12px 6px;color:#ffffff">
      <p style="margin:0;font:700 10px/1.2 ${SANS};letter-spacing:1.6px;text-transform:uppercase;color:${COLORS.goldSoft}">${
    weekday.slice(0, 3)
  }.</p>
      <p style="margin:4px 0 0;font:400 34px/1 ${SERIF};color:#ffffff;${struck}">${day}</p>
      <p style="margin:2px 0 0;font:13px/1.3 ${SANS};color:#dfe5f0">${month}</p>
      <p style="margin:8px 0 0;padding-top:7px;border-top:1px solid ${
    TONE_DIVIDERS[tone]
  };font:700 14px/1.2 ${SANS};color:#ffffff">${time}</p>
    </td>
    <td valign="middle" style="padding:12px 14px">
      <p style="margin:0 0 6px;font:700 15px/1.4 ${SANS};color:${COLORS.ink}">${
    subjectOf(booking)
  }</p>
      <p style="margin:0 0 6px;font:15px/1.45 ${SANS};color:${COLORS.ink}">${venue}</p>
      <p style="margin:0;font:13px/1.4 ${SANS};color:${COLORS.soft}">${
    FORMAT_LABELS[booking.format]
  }</p>
    </td>
  </tr>
</table>`;
};

const availabilityHtml = (booking: Booking) =>
  booking.availability.length > 0
    ? formatAvailability(booking.availability).map(escapeHtml).join("<br>")
    : "Non précisées";

const requestCard = (booking: Booking, extra: string[] = []) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${COLORS.line};border-left:3px solid ${COLORS.navy};background:#ffffff">
  <tr><td style="padding:14px 16px">
    ${label("Objet")}
    <p style="margin:0 0 12px;font:700 16px/1.4 ${SANS};color:${COLORS.ink}">${
  subjectOf(booking)
}</p>
    ${label("Format souhaité")}
    <p style="margin:0 0 12px;font:15px/1.45 ${SANS};color:${COLORS.ink}">${
  FORMAT_LABELS[booking.format]
}</p>
    ${label("Disponibilités")}
    <p style="margin:0;font:15px/1.6 ${SANS};color:${COLORS.ink}">${
  availabilityHtml(booking)
}</p>
    ${extra.join("")}
  </td></tr>
</table>`;

const quote = (text: string) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
  <tr><td style="border-left:3px solid ${COLORS.gold};background:${COLORS.quote};padding:12px 14px;font:15px/1.6 ${SANS};color:${COLORS.body}">${
  escapeHtml(text).replace(/\n/g, "<br>")
}</td></tr>
</table>`;

const layout = (headerTitle: string, content: string) =>
  `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.background}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.background}">
  <tr><td align="center" style="padding:16px 8px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.paper};border-top:3px solid ${COLORS.navy}">
      <tr><td style="padding:16px 18px;border-bottom:1px solid ${COLORS.line}">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px"><img src="${LOGO_URL}" width="32" height="32" alt="CH" style="display:block;width:32px;height:32px;border:0;background:${COLORS.navy};color:#ffffff;font:700 11px/32px ${SANS};text-align:center"></td>
          <td style="font:17px ${SERIF};color:${COLORS.navy}">${headerTitle}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:22px 18px 12px">${content}</td></tr>
      <tr><td style="padding:14px 18px;border-top:1px solid ${COLORS.line};font:12px/1.6 ${SANS};color:${COLORS.soft}">
        Charline HAYS · Avocate au Barreau de Paris<br>${CONFIG.officePhone} · ${CONFIG.notifyEmail}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

const clientRecipient = (booking: Booking) => ({
  email: booking.email,
  name: booking.full_name,
});

const officeReplyTo = { email: CONFIG.notifyEmail, name: "Charline HAYS" };

const callOffice: Button = {
  href: officePhoneHref,
  label: `Appeler le ${CONFIG.officePhone}`,
};

export const requestReceivedEmail = (booking: Booking): EmailMessage => ({
  to: clientRecipient(booking),
  replyTo: officeReplyTo,
  subject: "Votre demande de rendez-vous est bien reçue",
  html: layout(
    "Charline HAYS",
    heading("Demande bien reçue") +
      paragraph(
        `Bonjour ${
          firstName(booking)
        }, je reviens vers vous très rapidement pour convenir d'un rendez-vous.`,
      ) +
      requestCard(booking) +
      paragraph(
        "Une précision à ajouter ? Répondez simplement à cet email.",
      ) +
      buttons([callOffice]),
  ),
});

export const newRequestEmail = (booking: Booking): EmailMessage => ({
  to: { email: CONFIG.notifyEmail, name: "Charline HAYS" },
  replyTo: clientRecipient(booking),
  subject: `Nouvelle demande — ${
    SUBJECT_LABELS[booking.subject] ?? booking.subject
  } — ${booking.full_name}`,
  html: layout(
    "Nouvelle demande",
    heading(escapeHtml(booking.full_name)) +
      requestCard(booking, [
        `<div style="height:12px;font-size:0;line-height:0">&nbsp;</div>`,
        label("Contact"),
        `<p style="margin:0;font:15px/1.6 ${SANS};color:${COLORS.ink}">${
          [
            booking.phone
              ? `<a href="${
                phoneHref(booking.phone)
              }" style="color:${COLORS.navy}">${escapeHtml(booking.phone)}</a>`
              : null,
            `<a href="mailto:${
              escapeHtml(booking.email)
            }" style="color:${COLORS.navy}">${escapeHtml(booking.email)}</a>`,
          ].filter(Boolean).join("<br>")
        }</p>`,
      ]) +
      (booking.message ? quote(booking.message) : "") +
      buttons([
        { href: `${CONFIG.siteUrl}/admin`, label: "Fixer le rendez-vous" },
        ...(booking.phone
          ? [{
            href: phoneHref(booking.phone),
            label: `Appeler ${firstName(booking)}`,
            outline: true,
          }]
          : []),
      ]),
  ),
});

export const scheduledEmail = (
  booking: ScheduledBooking,
  rescheduled: boolean,
): EmailMessage => ({
  to: clientRecipient(booking),
  replyTo: officeReplyTo,
  subject: rescheduled
    ? `Votre rendez-vous est déplacé au ${
      formatDateTime(booking.starts_at).toLowerCase()
    }`
    : `Rendez-vous confirmé — ${
      formatDateTime(booking.starts_at).toLowerCase()
    }`,
  attachments: [buildIcsAttachment(booking)],
  html: layout(
    "Charline HAYS",
    heading(rescheduled ? "Rendez-vous déplacé" : "Rendez-vous confirmé") +
      dateCard(booking, "green") +
      paragraph(
        `Bonjour ${firstName(booking)}, je vous confirme ${
          rescheduled ? "le nouvel horaire de " : ""
        }notre rendez-vous. Pensez à apporter les documents utiles à votre dossier.`,
      ) +
      buttons([
        { href: googleCalendarUrl(booking), label: "Ajouter à mon agenda" },
        ...(booking.format === "cabinet"
          ? [{ href: MAPS_URL, label: "Itinéraire", outline: true }]
          : []),
      ]),
  ),
});

export const declinedEmail = (booking: Booking): EmailMessage => ({
  to: clientRecipient(booking),
  replyTo: officeReplyTo,
  subject: "Votre demande de rendez-vous",
  html: layout(
    "Charline HAYS",
    heading("Votre demande") +
      paragraph(
        `Bonjour ${
          firstName(booking)
        }, je ne suis malheureusement pas en mesure de donner suite à votre demande.`,
      ) +
      paragraph("Je reste joignable pour toute question.") +
      buttons([{ ...callOffice, outline: true }]),
  ),
});

export const cancelledEmail = (booking: ScheduledBooking): EmailMessage => ({
  to: clientRecipient(booking),
  replyTo: officeReplyTo,
  subject: "Votre rendez-vous est annulé",
  html: layout(
    "Charline HAYS",
    heading("Rendez-vous annulé") +
      dateCard(booking, "grey") +
      paragraph(
        `Bonjour ${
          firstName(booking)
        }, je dois malheureusement annuler notre rendez-vous. Je reviens vers vous pour en convenir d'un autre.`,
      ) +
      buttons([callOffice]),
  ),
});
