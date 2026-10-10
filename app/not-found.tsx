import type { Metadata } from "next";
import { NavBar } from "@/components/nav-bar";
import { PageHero } from "@/components/page-hero";
import { ContactActions } from "@/components/contact-actions";
import { PageSection } from "@/components/page-section";
import { RelatedDomains } from "@/components/related-domains";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

const NotFound = () => (
  <>
    <NavBar />
    <PageHero
      eyebrow="Erreur 404"
      title="Cette page n'existe pas"
      intro="Le lien est peut-être incorrect ou la page a été déplacée."
      crumb="Page introuvable"
    >
      <ContactActions placement="404" />
    </PageHero>
    <main>
      <PageSection
        eyebrow="Domaines d'intervention"
        title="Vous cherchiez peut-être"
      >
        <RelatedDomains />
      </PageSection>
    </main>
    <SiteFooter />
  </>
);

export default NotFound;
