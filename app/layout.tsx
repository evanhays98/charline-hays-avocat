import type { Metadata } from "next";
import { Mulish, Playfair_Display } from "next/font/google";
import { SITE_URL } from "@/lib/content";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PostHogInit } from "@/components/analytics/posthog-init";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Charline Hays — Avocate en droit de la famille à Paris",
  description:
    "Charline Hays, avocate au Barreau de Paris, intervient exclusivement en droit de la famille : divorce, autorité parentale, filiation, enlèvements internationaux d'enfants. Consultations sur rendez-vous.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Charline Hays — Avocate en droit de la famille à Paris",
    description:
      "Divorce, enfants, patrimoine : un accompagnement humain et rigoureux, à chaque étape de votre vie familiale.",
    url: SITE_URL,
    siteName: "Charline Hays — Avocate",
    locale: "fr_FR",
    type: "website",
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html
    lang="fr"
    className={`${playfair.variable} ${mulish.variable} antialiased`}
  >
    <body className="bg-paper font-sans text-[17px] leading-relaxed text-ink">
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.will-reveal{opacity:1 !important;transform:none !important}</style>",
        }}
      />
      <PostHogInit />
      <MotionProvider>{children}</MotionProvider>
    </body>
  </html>
);

export default RootLayout;
