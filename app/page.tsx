import { CONTACT, SITE_URL } from "@/lib/content";
import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { FactsBar } from "@/components/facts-bar";
import { DomainsSection } from "@/components/domains-section";
import { AboutSection } from "@/components/about-section";
import { ProcessSection } from "@/components/process-section";
import { FeesSection } from "@/components/fees-section";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";

const attorneyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Attorney",
  name: "Charline HAYS",
  url: SITE_URL,
  image: `${SITE_URL}/portrait.jpg`,
  telephone: "+33615570055",
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "47 avenue Hoche",
    postalCode: "75008",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  areaServed: "Île-de-France",
  knowsAbout: [
    "Droit de la famille",
    "Divorce",
    "Filiation",
    "Enlèvements internationaux d'enfants",
  ],
};

const HomePage = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd) }}
    />
    <NavBar />
    <Hero />
    <FactsBar />
    <main>
      <DomainsSection />
      <AboutSection />
      <ProcessSection />
      <FeesSection />
      <FaqSection />
      <ContactSection />
    </main>
    <SiteFooter />
  </>
);

export default HomePage;
