const read = (name: string, fallback: string) => Deno.env.get(name) ?? fallback;

export const CONFIG = {
  supabaseUrl: read("SUPABASE_URL", ""),
  anonKey: read("SUPABASE_ANON_KEY", ""),
  serviceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY", ""),
  brevoApiKey: Deno.env.get("BREVO_API_KEY"),
  mailpitUrl: Deno.env.get("MAILPIT_URL"),
  emailRedirectTo: Deno.env.get("EMAIL_REDIRECT_TO"),
  vapidKeys: Deno.env.get("VAPID_KEYS"),
  vapidSubject: read("VAPID_SUBJECT", "mailto:charlinehays.avocat@gmail.com"),
  senderEmail: read("MAIL_SENDER_EMAIL", "rendez-vous@haysavocat.fr"),
  senderName: read("MAIL_SENDER_NAME", "Charline HAYS — Avocate"),
  notifyEmail: read("NOTIFY_EMAIL", "charlinehays.avocat@gmail.com"),
  siteUrl: read("SITE_URL", "https://haysavocat.fr"),
  allowedOrigin: read("ALLOWED_ORIGIN", "*"),
  officeAddress: read("OFFICE_ADDRESS", "156 avenue Victor Hugo, 75116 Paris"),
  officePhone: read("OFFICE_PHONE", "06 15 57 00 55"),
  timezone: "Europe/Paris",
};

export const LOGO_URL = Deno.env.get("LOGO_URL") ??
  `${CONFIG.supabaseUrl}/storage/v1/object/public/public-assets/logo-email.png`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${
  encodeURIComponent(CONFIG.officeAddress)
}`;
