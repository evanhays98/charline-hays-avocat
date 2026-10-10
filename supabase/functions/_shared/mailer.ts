import { CONFIG } from "./config.ts";

interface Recipient {
  email: string;
  name?: string;
}

interface Attachment {
  name: string;
  content: string;
}

export interface EmailMessage {
  to: Recipient;
  subject: string;
  html: string;
  replyTo?: Recipient;
  attachments?: Attachment[];
}

const redirected = (message: EmailMessage): EmailMessage => {
  if (!CONFIG.emailRedirectTo) return message;
  return {
    ...message,
    to: { email: CONFIG.emailRedirectTo, name: message.to.name },
    subject: `[TEST → ${message.to.email}] ${message.subject}`,
  };
};

const sendWithMailpit = async (mailpitUrl: string, message: EmailMessage) => {
  const response = await fetch(`${mailpitUrl}/api/v1/send`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      From: { Email: CONFIG.senderEmail, Name: CONFIG.senderName },
      To: [{ Email: message.to.email, Name: message.to.name ?? "" }],
      ReplyTo: message.replyTo
        ? [{ Email: message.replyTo.email, Name: message.replyTo.name ?? "" }]
        : [],
      Subject: message.subject,
      HTML: message.html,
      Attachments: (message.attachments ?? []).map(({ name, content }) => ({
        Filename: name,
        Content: content,
      })),
    }),
  });
  if (response.ok) return true;
  console.error(`Mailpit ${response.status} : ${await response.text()}`);
  return false;
};

const sendWithBrevo = async (apiKey: string, message: EmailMessage) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: CONFIG.senderName, email: CONFIG.senderEmail },
      to: [message.to],
      replyTo: message.replyTo,
      subject: message.subject,
      htmlContent: message.html,
      attachment: message.attachments,
    }),
  });
  if (response.ok) return true;
  console.error(`Brevo ${response.status} : ${await response.text()}`);
  return false;
};

export const sendEmail = (original: EmailMessage) => {
  const message = redirected(original);
  if (CONFIG.mailpitUrl) return sendWithMailpit(CONFIG.mailpitUrl, message);
  if (CONFIG.brevoApiKey) return sendWithBrevo(CONFIG.brevoApiKey, message);
  console.warn(`Aucun service d'envoi configuré : ${message.subject}`);
  return Promise.resolve(false);
};
