// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeHeadingAnchors } from "./src/utils/rehypeHeadingAnchors";
import { rehypeTableScroll } from "./src/utils/rehypeTableScroll";

// https://astro.build/config
export default defineConfig({
  site: "https://yeison-liscano.github.io",
  base: "/portfolio/",
  trailingSlash: "always",
  // Posts renamed to fix typos in their URLs; old links keep working.
  // cspell:ignore algoritms inidicadores economicos decriptive
  // Sources are routes (base added by Astro); destinations need the base.
  redirects: {
    "/blog/algoritms/": "/portfolio/blog/algorithms/",
    "/blog/inidicadores-economicos/": "/portfolio/blog/indicadores-economicos/",
    "/blog/inferential-vs-decriptive-statistics/":
      "/portfolio/blog/inferential-vs-descriptive-statistics/",
    "/blog/rcp/": "/portfolio/blog/json-rpc/",
  },
  markdown: {
    rehypePlugins: [
      // Ids first, so the anchors can link to them. Astro runs it again
      // after these plugins; existing ids are kept.
      rehypeHeadingIds,
      rehypeHeadingAnchors,
      [
        rehypeExternalLinks,
        {
          // Decorative: screen readers already announce the link.
          content: { type: "text", value: "↗" },
          contentProperties: {
            className: ["external-mark"],
            ariaHidden: "true",
          },
          rel: ["noopener", "noreferrer"],
          target: "_blank",
          class: "external-link",
        },
      ],
      rehypeTableScroll,
    ],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "tokyo-night",
      },
      wrap: true,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !new URL(page).pathname.startsWith("/portfolio/blog/drafs/"),
    }),
  ],
});
