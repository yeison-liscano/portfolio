// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://yeison-liscano.github.io",
  base: "/portfolio/",
  trailingSlash: "always",
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
  integrations: [sitemap()],
});
