import { homeJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
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
import { MobileActionBar } from "@/components/mobile-action-bar";

const HomePage = () => (
  <>
    <JsonLd data={homeJsonLd()} />
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
    <MobileActionBar />
  </>
);

export default HomePage;
