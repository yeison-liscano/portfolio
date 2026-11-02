/**
 * Turns an MDX post body into plain Markdown for the RSS feed.
 *
 * Feed readers cannot run Astro components, and markdown-it would print MDX
 * imports and component tags as text. Imports are dropped; a top-level
 * component block becomes its caption (figures) or alt text (images), so the
 * feed keeps what the figure says and points readers to the full post.
 */

// A component block starts at column 0 with a capitalized tag.
const BLOCK_START = /^<([A-Z][A-Za-z0-9]*)\b/;
const attribute = (block: string, name: string): string | undefined =>
  new RegExp(`\\b${name}="([^"]*)"`).exec(block)?.[1];

// Prettier closes a top-level block at column 0: `</Name>` or a bare `/>`.
const isBlockEnd = (line: string, name: string): boolean =>
  line === `</${name}>` || line === "/>";

// Inline components (ExternalLink, InternalLink, Acronym, Term) sit inside a
// sentence. They become a Markdown link or plain text, so the sentence stays
// whole. Left as tags, markdown-it would print them escaped, and one that a
// line wrap put at column 0 would be read as a block and dropped.
const ATTRIBUTES = String.raw`(?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}))?)*\s*`;
const INLINE = new RegExp(
  String.raw`<(ExternalLink|InternalLink|Acronym|Term)(${ATTRIBUTES})>([\s\S]*?)</\1>`,
  "g",
);
// Fenced code is copied as is: a post may show these tags as an example. The
// capture group keeps each fence in split()'s output, at the odd indexes.
const FENCE = /(^```[^\n]*\n[\s\S]*?^```[^\n]*$)/m;

const inlineToMarkdown = (
  name: string,
  attributes: string,
  text: string,
  postUrl: string,
): string => {
  if (name === "ExternalLink") {
    const href = attribute(attributes, "href");
    return href ? `[${text}](${href})` : text;
  }
  if (name === "InternalLink") {
    const slug = attribute(attributes, "slug");
    const hash = attribute(attributes, "hash");
    if (!slug) return text;
    // postUrl is .../blog/<id>/, so a sibling post is ../<slug>/.
    const target = new URL(`../${slug}/${hash ? `#${hash}` : ""}`, postUrl);
    return `[${text}](${target.href})`;
  }
  if (name === "Acronym") {
    const title = attribute(attributes, "title");
    return title ? `${text} (${title})` : text;
  }
  return text;
};

const replaceInline = (body: string, postUrl: string): string =>
  body
    .split(FENCE)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(
            INLINE,
            (_, name: string, attributes: string, text: string) =>
              inlineToMarkdown(name, attributes, text, postUrl),
          ),
    )
    .join("");

const summarize = (block: string, postUrl: string): string => {
  const caption = attribute(block, "caption");
  if (caption) {
    return `*Figure: ${caption}* ([interactive version in the post](${postUrl}))`;
  }
  const alt = attribute(block, "alt");
  return alt ? `*Image: ${alt}*` : "";
};

export const mdxToMarkdown = (body: string, postUrl: string): string => {
  const lines = replaceInline(body, postUrl).split("\n");
  const output: string[] = [];
  let index = 0;
  let inCode = false;

  while (index < lines.length) {
    const line = lines[index];
    if (line.startsWith("```")) inCode = !inCode;

    const start = inCode ? null : BLOCK_START.exec(line);
    if (!inCode && line.startsWith("import ")) {
      index += 1;
      continue;
    }
    if (!start) {
      output.push(line);
      index += 1;
      continue;
    }

    const name = start[1];
    const block: string[] = [line];
    const singleLine =
      line.trim().endsWith("/>") || line.trim().endsWith(`</${name}>`);
    while (!singleLine && index + 1 < lines.length) {
      index += 1;
      block.push(lines[index]);
      if (isBlockEnd(lines[index], name)) break;
    }
    output.push(summarize(block.join("\n"), postUrl));
    index += 1;
  }

  return output.join("\n");
};
