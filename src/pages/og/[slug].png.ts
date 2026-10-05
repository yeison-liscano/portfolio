/**
 * Link-preview image for each post, rendered at build time to
 * /og/<slug>.png: the post title on the same card as the site image.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { label } from "../../utils/format";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.isDraft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

// Static OTF files (see src/assets/fonts/og/OFL.txt): satori cannot use the
// site's variable WOFF2 fonts, and its WOFF decoding drew every character as
// the missing-glyph box.
const font = (weight: 400 | 700) =>
  readFile(
    join(
      process.cwd(),
      "src/assets/fonts/og",
      weight === 700 ? "Geist-Bold.otf" : "Geist-Regular.otf",
    ),
  );

// Colors of the dark site palette (src/styles/base.css).
const INK = "#d7dce2";
const ACCENT = "#ffcc66";
const GROUND = "#171c28";

type Node = { type: string; props: Record<string, unknown> };
const h = (
  type: string,
  style: Record<string, unknown>,
  children?: string | Node | Node[],
): Node => ({ type, props: { style, children } });

const card = (post: CollectionEntry<"blog">) => {
  const { title, tags } = post.data;
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: 64,
      backgroundColor: GROUND,
      color: INK,
      fontFamily: "Geist",
    },
    [
      h("div", { width: 52, height: 3, backgroundColor: ACCENT }),
      h(
        "div",
        { marginTop: 32, fontSize: 26, color: ACCENT },
        "Yeison Liscano · Blog",
      ),
      h(
        "div",
        {
          marginTop: 24,
          fontSize: title.length > 55 ? 58 : 72,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -1.5,
          maxWidth: 1040,
        },
        title,
      ),
      h("div", { flexGrow: 1 }),
      h(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: "rgba(215, 220, 226, 0.55)",
        },
        [
          h("div", {}, tags.map(label).join("  ·  ")),
          h("div", {}, "yeison-liscano.github.io/portfolio"),
        ],
      ),
    ],
  );
};

export const GET: APIRoute<{ post: CollectionEntry<"blog"> }> = async ({
  props,
}) => {
  const [regular, bold] = await Promise.all([font(400), font(700)]);
  const svg = await satori(card(props.post), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Geist", data: regular, weight: 400, style: "normal" },
      { name: "Geist", data: bold, weight: 700, style: "normal" },
    ],
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
