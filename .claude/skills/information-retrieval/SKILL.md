---
name: "information-retrieval"
description:
  "Retrieve information about the specified topic from the web, and return a
  summary of the most relevant information. Use when researching a blog post, or
  when asked to find, check or summarize sources for one."
argument-hint:
  "Topic to retrieve information about; Key concepts to retrieve information
  about; URL of the page to retrieve information from"
---

# Information retrieval

Retrieve information that could be used and referenced in a blog post. Any web
search result must be verified to come from an accurate and reliable source. Use
only reliable sources, and cite them in the post.

## Step by step

1. **List reliable sources.** If not done yet, identify the most reliable
   sources for the topic with the `reliable-sources` skill. From the main
   conversation you can delegate this to the `reliable-sources-identifier`
   agent. Inside an agent, apply the skill yourself: agents cannot start other
   agents.
2. **Identify the concepts.** List the key concepts the post needs, and the URLs
   in the reliable sources where each one is explained. Read the related posts
   in `src/blog` first, so the post does not repeat what they already cover.
3. **Retrieve.** Open those pages and take what the post needs: definitions,
   numbers, dates, examples. Copy numbers and names exactly as the source gives
   them, with the URL.
4. **Cross-check.** A claim the post depends on needs a primary source (a
   specification, the official documentation, the original paper) or two
   independent reliable sources. When sources disagree, report the conflict
   instead of picking a side.
5. **Summarize.** Return the result in the format below.

## Output format

- **Summary**: the most relevant information, grouped by concept. Each claim
  ends with the number of its source, like `[2]`.
- **Sources**: a numbered list. For each one: title, author or publisher, date,
  URL, and a one-sentence preview of what the page holds.
- **Open questions**: what the sources did not settle.

## Citing in the post

Any external website or article referenced in the post must use the
`ExternalLink` component (`src/components/blog/ExternalLink.astro`). It opens
the link in a new tab and shows a preview of the content before the reader
leaves. The one-sentence preview from the source list is its `preview`:

<!-- prettier-ignore -->
```mdx
TCP is defined in <ExternalLink href="https://www.rfc-editor.org/rfc/rfc9293" preview="The current TCP specification, which obsoletes RFC 793.">RFC 9293</ExternalLink>.
```

Keep the component inside the sentence, with at least one word before the tag on
the same line: Prettier reads a line that starts with a tag as a block and
splits the paragraph. Components only work in `.mdx` posts. List every cited
source again under `## References` (or its translation), the last section of the
post.
