import type { Metadata } from "next";
import Image from "next/image";
import { ABOUT_PAGE, VALUES } from "@/lib/content";
import { aboutJsonLd } from "@/lib/structured-data";
import { SHARE_IMAGES } from "@/lib/share-image";
import { JsonLd } from "@/components/json-ld";
import { NavBar } from "@/components/nav-bar";
import { PageHero } from "@/components/page-hero";
import { ContactActions } from "@/components/contact-actions";
import { PageSection } from "@/components/page-section";
import { CheckList } from "@/components/check-list";
import { RelatedDomains } from "@/components/related-domains";
import { SiteFooter } from "@/components/site-footer";
import { MobileActionBar } from "@/components/mobile-action-bar";

export const metadata: Metadata = {
  title: ABOUT_PAGE.metaTitle,
  description: ABOUT_PAGE.metaDescription,
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: `${ABOUT_PAGE.heading}`,
    description: ABOUT_PAGE.metaDescription,
    url: "/a-propos",
    type: "profile",
    images: SHARE_IMAGES,
  },
};

const AboutPage = () => (
  <>
    <JsonLd data={aboutJsonLd()} />
    <NavBar />
    <PageHero
      eyebrow="À propos"
      title={ABOUT_PAGE.heading}
      intro={`« ${ABOUT_PAGE.intro} »`}
      crumb="À propos"
    >
      <ContactActions placement="a-propos" />
    </PageHero>
    <main>
      <section className="py-14 md:py-18">
        <div className="mx-auto grid max-w-5xl gap-10 px-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="relative max-w-80">
            <Image
              src="/portrait.webp"
              alt="Maître Charline HAYS, avocate au Barreau de Paris"
              width={503}
              height={690}
              className="w-full object-cover"
            />
            <div className="pointer-events-none absolute -top-2 -left-2 size-9 border-t-[1.5px] border-l-[1.5px] border-gold" />
            <div className="pointer-events-none absolute -right-2 -bottom-2 size-9 border-r-[1.5px] border-b-[1.5px] border-gold" />
          </div>
          <div className="flex flex-col gap-5 text-[17px] text-[#3a4256]">
            {ABOUT_PAGE.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <dl className="mt-2 grid border-t border-line sm:grid-cols-3">
              {VALUES.map(({ title, description }) => (
                <div
                  key={title}
                  className="flex items-baseline gap-4 border-b border-line py-3.5 sm:block sm:border-b-0 sm:border-l sm:pt-4 sm:pr-3 sm:pb-0 sm:pl-4 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="w-28 shrink-0 font-serif text-[19px] font-medium text-navy sm:w-auto">
                    {title}
                  </dt>
                  <dd className="text-[14px] leading-snug text-ink-soft sm:mt-0.5 sm:text-[13px]">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      {ABOUT_PAGE.career.length > 0 ? (
        <PageSection eyebrow="Parcours" title="Formation et parcours">
          <CheckList items={ABOUT_PAGE.career} />
        </PageSection>
      ) : null}
      <PageSection
        eyebrow="Domaines d'intervention"
        title="Le droit de la famille, exclusivement"
      >
        <RelatedDomains />
      </PageSection>
    </main>
    <SiteFooter />
    <MobileActionBar alwaysVisible />
  </>
);

export default AboutPage;
