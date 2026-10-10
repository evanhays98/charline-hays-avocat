import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOMAIN_PAGES } from "@/lib/content";
import { domainJsonLd } from "@/lib/structured-data";
import { SHARE_IMAGES } from "@/lib/share-image";
import { JsonLd } from "@/components/json-ld";
import { NavBar } from "@/components/nav-bar";
import { PageHero } from "@/components/page-hero";
import { ContactActions } from "@/components/contact-actions";
import { PageSection } from "@/components/page-section";
import { CheckList } from "@/components/check-list";
import { NumberedSteps } from "@/components/numbered-steps";
import { FaqAccordion } from "@/components/faq-accordion";
import { RelatedDomains } from "@/components/related-domains";
import { SiteFooter } from "@/components/site-footer";
import { MobileActionBar } from "@/components/mobile-action-bar";

export const dynamicParams = false;

export const generateStaticParams = () =>
  DOMAIN_PAGES.map(({ slug }) => ({ slug }));

const findPage = (slug: string) =>
  DOMAIN_PAGES.find((page) => page.slug === slug);

export const generateMetadata = async ({
  params,
}: PageProps<"/domaines/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  const path = `/domaines/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${page.heading} · Charline HAYS, avocate`,
      description: page.metaDescription,
      url: path,
      type: "article",
      images: SHARE_IMAGES,
    },
  };
};

const DomainPage = async ({ params }: PageProps<"/domaines/[slug]">) => {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={domainJsonLd(page)} />
      <NavBar />
      <PageHero
        eyebrow="Domaine d'intervention · Paris"
        title={page.heading}
        intro={page.intro}
        crumb={page.title}
      >
        <ContactActions subject={page.situation} placement={page.slug} />
      </PageHero>
      <main>
        <PageSection eyebrow="Accompagnement" title="Ce que je fais pour vous">
          <CheckList items={page.services} />
        </PageSection>
        <PageSection eyebrow="Déroulé" title="Comment ça se passe">
          <NumberedSteps steps={page.steps} />
        </PageSection>
        <PageSection eyebrow="Questions fréquentes" title="Vos questions">
          <FaqAccordion entries={page.faq} />
        </PageSection>
        <section className="bg-navy text-[#edf0f7]">
          <div className="mx-auto max-w-5xl px-7 py-14 md:py-18">
            <h2 className="font-serif text-3xl font-medium text-balance text-white md:text-4xl">
              Parlons de votre situation
            </h2>
            <ContactActions
              subject={page.situation}
              placement={`${page.slug}-bas`}
            />
          </div>
        </section>
        <PageSection eyebrow="Domaines d'intervention" title="Autres domaines">
          <RelatedDomains currentSlug={page.slug} />
        </PageSection>
      </main>
      <SiteFooter />
      <MobileActionBar alwaysVisible />
    </>
  );
};

export default DomainPage;
