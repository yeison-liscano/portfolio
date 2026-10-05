import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { type BuiltinLanguage } from "shiki";

const blogCollection = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/blog" }),
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    snippet: z.object({
      code: z.string(),
      language: z.custom<BuiltinLanguage>(),
    }),
    author: z.string().default("Yeison Liscano"),
    tags: z.array(z.string()),
    /** Language of the post, for <html lang> and link previews. */
    lang: z.enum(["en", "es", "fr"]).default("en"),
    footnote: z.string().optional(),
    pubDate: z.date(),
    description: z.string(),
    /** Optional override; otherwise estimated from the post body. */
    readingTime: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
