import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { type BuiltinLanguage } from "shiki";

const blogCollection = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/blog" }),
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    snippet: z.object({
      code: z.string(),
      language: z.custom<BuiltinLanguage>(),
    }),
    author: z.string().default("Yeison Liscano"),
    tags: z.array(z.string()),
    footnote: z.string().optional(),
    pubDate: z.date(),
    description: z.string(),
    readingTime: z.string().default("1 min read"),
  }),
});

export const collections = {
  blog: blogCollection,
};
