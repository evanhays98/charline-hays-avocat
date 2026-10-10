import type { Metadata } from "next";
import { Mulish, Playfair_Display } from "next/font/google";
import { SEO, SITE_URL } from "@/lib/content";
import { SHARE_IMAGES } from "@/lib/share-image";
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
  title: {
    default: SEO.homeTitle,
    template: "%s · Charline HAYS, avocate",
  },
  description: SEO.homeDescription,
  applicationName: SEO.siteName,
  authors: [{ name: "Charline Hays", url: `${SITE_URL}/a-propos` }],
  creator: "Charline Hays",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    title: SEO.homeTitle,
    description:
      "Divorce, enfants, patrimoine : un accompagnement humain et rigoureux, à chaque étape de votre vie familiale.",
    url: "/",
    siteName: SEO.siteName,
    locale: "fr_FR",
    type: "website",
    images: SHARE_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.homeTitle,
    description:
      "Divorce, enfants, patrimoine : un accompagnement humain et rigoureux, à chaque étape de votre vie familiale.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
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
