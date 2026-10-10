import type { MetadataRoute } from "next";
import { DOMAIN_PAGES, SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

const lastModified = new Date();

const domainEntries: MetadataRoute.Sitemap = DOMAIN_PAGES.map(({ slug }) => ({
  url: `${SITE_URL}/domaines/${slug}`,
  lastModified,
  changeFrequency: "yearly",
  priority: 0.8,
}));

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${SITE_URL}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/a-propos`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  },
  ...domainEntries,
];

export default sitemap;
