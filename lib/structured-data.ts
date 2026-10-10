import {
  CONTACT,
  DOMAIN_PAGES,
  SEO,
  SITE_URL,
  type DomainPage,
} from "@/lib/content";

const ORGANIZATION_ID = `${SITE_URL}/#cabinet`;
const PERSON_ID = `${SITE_URL}/#charline-hays`;
const WEBSITE_ID = `${SITE_URL}/#site`;

const address = {
  "@type": "PostalAddress",
  streetAddress: "156 avenue Victor Hugo",
  postalCode: "75116",
  addressLocality: "Paris",
  addressRegion: "Île-de-France",
  addressCountry: "FR",
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SEO.siteName,
  alternateName: SEO.alternateNames,
  inLanguage: "fr-FR",
  publisher: { "@id": ORGANIZATION_ID },
};

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Charline Hays",
  givenName: "Charline",
  familyName: "Hays",
  jobTitle: "Avocate",
  url: `${SITE_URL}/a-propos`,
  image: `${SITE_URL}/portrait.jpg`,
  worksFor: { "@id": ORGANIZATION_ID },
  memberOf: {
    "@type": "Organization",
    name: "Barreau de Paris",
    url: "https://www.avocatparis.org",
  },
  knowsLanguage: "fr",
  ...(SEO.profiles.length > 0 ? { sameAs: SEO.profiles } : {}),
};

const legalService = {
  "@type": "LegalService",
  "@id": ORGANIZATION_ID,
  name: SEO.siteName,
  alternateName: SEO.alternateNames,
  description: SEO.homeDescription,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/icon.svg`,
  telephone: "+33615570055",
  email: CONTACT.email,
  address,
  geo: {
    "@type": "GeoCoordinates",
    latitude: SEO.geo.latitude,
    longitude: SEO.geo.longitude,
  },
  areaServed: [
    { "@type": "City", name: "Paris" },
    { "@type": "AdministrativeArea", name: "Île-de-France" },
  ],
  founder: { "@id": PERSON_ID },
  employee: { "@id": PERSON_ID },
  knowsAbout: [
    "Droit de la famille",
    ...DOMAIN_PAGES.map(({ title }) => title),
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Domaines d'intervention",
    itemListElement: DOMAIN_PAGES.map(({ heading, slug }) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: heading,
        url: `${SITE_URL}/domaines/${slug}`,
      },
    })),
  },
  ...(SEO.profiles.length > 0 ? { sameAs: SEO.profiles } : {}),
};

const graph = (nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(({ name, path }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});

export const homeJsonLd = () => graph([website, legalService, person]);

export const domainJsonLd = (page: DomainPage) =>
  graph([
    legalService,
    {
      "@type": "Service",
      name: page.heading,
      description: page.metaDescription,
      url: `${SITE_URL}/domaines/${page.slug}`,
      serviceType: page.title,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "City", name: "Paris" },
    },
    breadcrumb([
      { name: "Accueil", path: "/" },
      { name: page.title, path: `/domaines/${page.slug}` },
    ]),
  ]);

export const aboutJsonLd = () =>
  graph([
    legalService,
    person,
    {
      "@type": "AboutPage",
      url: `${SITE_URL}/a-propos`,
      mainEntity: { "@id": PERSON_ID },
    },
    breadcrumb([
      { name: "Accueil", path: "/" },
      { name: "À propos", path: "/a-propos" },
    ]),
  ]);
