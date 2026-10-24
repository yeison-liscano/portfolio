/**
 * rehypeHeadingAnchors - Adds a "#" link to every h2 and h3 in a post.
 *
 * Readers who skim headings get a visible hook to copy a link to one
 * section. The link has no text of its own (Post.astro draws the "#" with
 * CSS), so the heading text Astro collects for the table of contents stays
 * the same when its heading-id pass runs again after this plugin.
 *
 * It needs heading ids, so astro.config.mjs runs Astro's rehypeHeadingIds
 * before it.
 */

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

interface VFileLike {
  data: { astro?: { frontmatter?: Record<string, unknown> } };
}

const LABEL: Record<string, string> = {
  en: "Link to this section",
  es: "Enlace a esta sección",
  fr: "Lien vers cette section",
};

const HEADINGS = new Set(["h2", "h3"]);

const addAnchors = (node: HastNode, label: string): void => {
  node.children?.forEach((child) => {
    const id = child.properties?.id;
    if (
      child.type === "element" &&
      HEADINGS.has(child.tagName ?? "") &&
      typeof id === "string"
    ) {
      child.children = [
        ...(child.children ?? []),
        {
          type: "element",
          tagName: "a",
          properties: {
            className: ["heading-anchor"],
            href: `#${id}`,
            ariaLabel: label,
          },
          children: [],
        },
      ];
      return;
    }
    addAnchors(child, label);
  });
};

export const rehypeHeadingAnchors =
  () =>
  (tree: HastNode, file: VFileLike): void => {
    const lang = file.data.astro?.frontmatter?.lang;
    addAnchors(tree, LABEL[typeof lang === "string" ? lang : "en"] ?? LABEL.en);
  };
