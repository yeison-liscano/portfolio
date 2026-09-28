import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { mdxToMarkdown } from "../utils/mdxToMarkdown";

const parser = new MarkdownIt();
const BASE_URL = import.meta.env.BASE_URL;

/**
 * @param {{ site: URL }} context
 */
export async function GET(context) {
  const blog = (await getCollection("blog", ({ data }) => !data.isDraft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: "Yeison Liscano",
    description:
      "Articles by Yeison Liscano on MCP, AI agents, security, Python, algorithms and economics.",
    site: context.site,
    items: blog.map((post) => {
      const link = `${BASE_URL}blog/${post.id}/`;
      const markdown = mdxToMarkdown(
        post.body ?? "",
        new URL(link, context.site).href,
      );
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        categories: post.data.tags,
        link,
        content: sanitizeHtml(parser.render(markdown), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
      };
    }),
  });
}
