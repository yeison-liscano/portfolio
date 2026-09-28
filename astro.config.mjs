// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

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
      [
        rehypeExternalLinks,
        {
          content: { type: "text", value: " 🔗" },
          rel: ["noopener", "noreferrer"],
          target: "_blank",
          class: "external-link",
        },
      ],
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
  integrations: [mdx(), sitemap()],
});
