/**
 * Display helpers shared by post pages and the blog index.
 */

/**
 * Frontmatter dates are parsed as UTC midnight, so format them in UTC too.
 * Formatting in the reader's time zone would show the previous day west of
 * Greenwich (for example in Colombia).
 */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** `YYYY-MM-DD`, the machine-readable value for `<time datetime>`. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

const WORDS_PER_MINUTE = 220;

/** Estimated reading time from the raw post body, never less than 1 minute. */
export const readingTime = (body = ""): string => {
  const prose = body
    .replace(/^import .*$/gm, "") // MDX imports
    .replace(/<[^>]+>/g, " "); // JSX and HTML tags
  const words = prose.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
};

/** Display names for tags and code languages whose slug is not the name. */
const LABELS: Record<string, string> = {
  ai: "AI",
  mcp: "MCP",
  devops: "DevOps",
  "data-science": "Data science",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  bash: "Bash",
  docker: "Dockerfile",
  javascript: "JavaScript",
  typescript: "TypeScript",
};

/** Human label for a tag or language slug: "ai" -> "AI", "web" -> "Web". */
export const label = (slug: string): string =>
  LABELS[slug] ??
  slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
