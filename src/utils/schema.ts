/**
 * Schema.org structured data, rendered as JSON-LD in <head>. Search engines
 * use it for rich results: the author card on the home page and article
 * details (author, dates, image) on posts.
 */
import type { CollectionEntry } from "astro:content";

const SITE = "https://yeison-liscano.github.io/portfolio/";

export const person = {
  "@type": "Person",
  "@id": `${SITE}#person`,
  name: "Yeison Liscano",
  url: SITE,
  jobTitle: "AI & Security Engineer",
  worksFor: { "@type": "Organization", name: "Fluid Attacks" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Medellín",
    addressCountry: "CO",
  },
  sameAs: [
    "https://www.linkedin.com/in/yeison-liscano/",
    "https://github.com/yeison-liscano",
    "https://pypi.org/project/http-mcp/",
  ],
  knowsAbout: [
    "Application security",
    "Model Context Protocol",
    "AI agents",
    "Python",
    "TypeScript",
    "AWS",
  ],
};

/** Home page: the person and the site they publish. */
export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    {
      "@type": "WebSite",
      "@id": `${SITE}#website`,
      url: SITE,
      name: "Yeison Liscano",
      publisher: { "@id": `${SITE}#person` },
      inLanguage: "en",
    },
  ],
};

/** A blog post, with its author and preview image. */
export const blogPostingSchema = (
  post: CollectionEntry<"blog">,
  url: string,
  image: string,
) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.pubDate.toISOString(),
  inLanguage: post.data.lang,
  keywords: post.data.tags.join(", "),
  url,
  mainEntityOfPage: url,
  image,
  author: person,
  publisher: { "@id": `${SITE}#person` },
});
