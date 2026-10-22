/**
 * rehypeTableScroll - Wraps every Markdown table in a scroll container.
 *
 * A wide table then scrolls sideways inside the post instead of widening the
 * page on phones, and the table keeps its native semantics (no
 * `display: block` on the table itself). The container is a labelled,
 * focusable region so keyboard users can scroll it too; Post.astro removes
 * the tab stop again from tables that fit the column.
 *
 * Tables written inside Astro components are not touched: they never pass
 * through the Markdown pipeline.
 */

interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

interface VFileLike {
  data: { astro?: { frontmatter?: Record<string, unknown> } };
}

const WORD: Record<string, string> = {
  en: "Table",
  es: "Tabla",
  fr: "Tableau",
};

const text = (node: HastNode): string =>
  node.type === "text"
    ? (node.value ?? "")
    : (node.children ?? []).map(text).join("");

const descendants = (node: HastNode, tagName: string): HastNode[] => [
  ...(node.tagName === tagName ? [node] : []),
  ...(node.children ?? []).flatMap((child) => descendants(child, tagName)),
];

/** "Tabla: Tipo, Aristas, ¿Lazos?" from the table's header cells. */
export const tableLabel = (table: HastNode, lang: string): string => {
  const word = WORD[lang] ?? WORD.en;
  const headers = descendants(table, "th")
    .map((cell) => text(cell).trim())
    .filter(Boolean);
  return headers.length > 0 ? `${word}: ${headers.join(", ")}` : word;
};

const wrapTables = (node: HastNode, lang: string): void => {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type !== "element" || child.tagName !== "table") {
      wrapTables(child, lang);
      return child;
    }
    const label = tableLabel(child, lang);
    return {
      type: "element",
      tagName: "div",
      properties: {
        className: ["table-scroll"],
        role: "region",
        tabIndex: 0,
        ariaLabel: label,
        dataTableLabel: label,
      },
      children: [child],
    };
  });
};

export const rehypeTableScroll =
  () =>
  (tree: HastNode, file: VFileLike): void => {
    const lang = file.data.astro?.frontmatter?.lang;
    wrapTables(tree, typeof lang === "string" ? lang : "en");
  };
