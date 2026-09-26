import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();
const BASE_URL = import.meta.env.BASE_URL;

/**
 * @param {{ site: any; }} context
 */
export async function GET(context) {
  const blog = await getCollection("blog", ({ data }) => !data.isDraft);

  return rss({
    title: "Yeison Liscano Portfolio",
    description: "About Yeison Liscano and his work and life",
    site: context.site,
    items: blog.map((post) => ({
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      link: `${BASE_URL}blog/${post.id}/`,
      ...post.data,
    })),
  });
}
