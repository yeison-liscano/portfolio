---
name: blog-artifacts
description: >-
  Give posts in this Astro portfolio the same range a Claude artifact has:
  hand-drawn SVG diagrams, Mermaid diagrams, build-time charts, step-through
  explanations, explorable widgets driven by sliders or inputs, and runnable
  Python, all themed to the site's light/dark palette. Use whenever writing,
  editing or upgrading a post in src/blog/, or when asked to add a diagram,
  chart, visualization, animation, interactive demo or example to the blog, or
  to make a post "more visual", "interactive" or "like an artifact".
---

# Blog artifacts

A Claude artifact is a standalone HTML page that can hold anything: custom
styling, inline SVG diagrams, charts, and scripted interaction. A post on this
blog can do the same things, but it lives inside a shared layout, a design
system and a build pipeline. This skill maps each artifact capability onto the
blog and sets the rules that keep the result working in both themes, on phones,
without JavaScript, and through the repo's lint and CI gates.

Read the references when you get to that part of the work:

- `references/design.md`: visual and copy rules for figures inside posts.
- `references/diagrams.md`: what to draw, and inline SVG mechanics.
- `references/interactivity.md`: Astro scripts, custom elements, state,
  accessibility, MDX gotchas.
- `templates/`: working components to copy and adapt.

## Artifact vs. post

| Concern       | Artifact                          | Blog post (this repo)                                                                                   |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Container     | Whole HTML page                   | MDX body inside `layouts/Post.astro` (hero, TOC, aside already exist)                                   |
| Identity      | New palette and fonts per page    | Inherit the site. Geist Sans, Geist Mono, Space Grotesk; tokens in `src/styles/base.css`                |
| Theme         | `data-theme` + media query tokens | Same idea, already wired: use the site tokens and never write theme blocks yourself                     |
| Libraries     | CDN allowlist, UMD globals        | Zero dependencies first. Ask before adding an npm package. Runtime CDN loads only lazily, pinned.       |
| Mermaid       | Rendered natively                 | `components/blog/Mermaid.astro`                                                                         |
| Scripts       | Inline, run once                  | Astro bundles a component `<script>` once per page, so use custom elements                              |
| Complete view | First frame before interaction    | Also RSS, no-JS readers, and search engines: server-render the resting state                            |
| Checking      | One preview, then publish         | `pnpm run check`, `pnpm run eslint`, `pnpm run format:check`, `pnpm run build`, one look in the browser |

## Workflow

1. **Read the post and decide what earns a picture.** A figure earns its place
   when it shows a mechanism the reader would otherwise assemble from prose:
   where data flows, what changes between two options, what state something
   moves through, how a number grows. If a sentence says it faster, write the
   sentence. Most posts need one to three figures, not one per section.
2. **Convert to MDX if needed.** Components only work in `.mdx`. Rename
   `post.md` to `post.mdx`; the post id and URL do not change because the id is
   the file name without extension. Then fix what MDX rejects (see
   `references/interactivity.md`, "MDX gotchas").
3. **Pick the tool** for each figure from the table below.
4. **Plan each figure in one line** before writing it: the claim it makes, the
   form, and the one element that gets the accent color. Example: "Claim: the
   load balancer loses the session. Form: SVG, two replicas side by side.
   Accent: the request that lands on replica B."
5. **Build.** Post-specific components go in `src/blog/components/<post-slug>/`.
   The content loader only globs `src/blog/*.{md,mdx}`, so subfolders are safe.
   Shared, reusable pieces go in `src/components/blog/`.
6. **Verify** (see "Verification"). Fix what it shows once, then stop.

## Choosing the tool

| The figure needs to...                                 | Use                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Show an architecture, flow or comparison precisely     | Hand-written inline SVG in a post component, inside `<Figure>`             |
| Show a sequence, state machine or flowchart quickly    | `<Mermaid>` inside `<Figure>`                                              |
| Reveal a process one step at a time                    | `<Stepper>` wrapping an SVG whose parts carry `data-step`                  |
| Plot numbers                                           | Build-time SVG chart (`templates/BuildTimeChart.astro`)                    |
| Compare how tasks overlap in time                      | `<Timeline>` inside `<Figure>`                                             |
| Let the reader change an input and see the consequence | Explorable custom element (`templates/Explorable.astro`)                   |
| Let the reader run code                                | A fenced `python` block. `PyodideRunner` adds Run and pydantic.run buttons |
| Show a screenshot or photo                             | `Image` from `astro:assets`, file in `src/blog/images/`                    |

Prefer hand-drawn SVG over Mermaid when the argument hinges on layout (which box
sits between which), on one highlighted edge, or on a side-by-side comparison.
Mermaid lays things out for you, which also means you cannot put the emphasis
where the argument needs it. It also loads about 1 MB from jsdelivr at runtime.

For charts, load the `dataviz` skill as well if it is available: it covers form
choice, color and mark specs. Its rules apply inside the constraints here.

## The shared components

They live in `src/components/blog/` and are imported by path from MDX. Four
frame or draw figures; four more mark up the prose (see "Links and definitions"
below).

```mdx
import Figure from "../components/blog/Figure.astro";
import Mermaid from "../components/blog/Mermaid.astro";
import Stepper from "../components/blog/Stepper.astro";
import SessionLoss from "./components/mcp/SessionLoss.astro";

<Figure caption="The second request lands on a replica that never saw the session.">
  <SessionLoss />
</Figure>

<Figure caption="The client lists tools once, then calls them by name.">
  <Mermaid
    label="Sequence: client lists tools, then calls one"
    code={`
sequenceDiagram
  Client->>Server: tools/list
  Server-->>Client: schemas
  Client->>Server: tools/call fix_metadata
`}
  />
</Figure>

<Figure caption="The handshake agrees on a key before any application data moves.">
  <Stepper
    label="TLS handshake"
    steps={[
      "The client proposes cipher suites and sends a random value.",
      "The server picks a suite and sends its certificate.",
      "Both sides derive the same session key.",
    ]}
  >
    <HandshakeDiagram />
  </Stepper>
</Figure>
```

- **`Figure`** (`caption` required): frames the content on a `--surface` panel,
  scrolls wide content inside itself, and scales child SVGs to the column. The
  caption states the claim in one sentence.
- **`Mermaid`** (`code`, `label`): lazy-loads Mermaid 12 from jsdelivr, colors
  it from the site palette, re-renders on theme toggle, and leaves the source
  visible if the script fails.
- **`Stepper`** (`steps`, `label`): elements with `data-step="N"` show as past,
  current or future; the current step turns `--contrast`. Draw strokes and text
  in `currentColor` so the highlight reaches them. Without JavaScript the
  complete diagram and the full numbered list of steps are shown.
- **`Timeline`** (`groups`, `max`, `tick`, `unit`, `label`, `legend`): a
  build-time Gantt chart. Each group is a scenario whose rows hold `cpu`, `wait`
  and `queue` segments; each group's finish time is the accent. Used by the
  concurrency and WSGI/ASGI posts.

### Links and definitions

These sit inside a sentence and show a note on hover or focus, built on
`Tooltip.astro`. Wrap the first use of an acronym or term, not every use.

<!-- prettier-ignore -->
```mdx
import Acronym from "../components/blog/Acronym.astro";
import ExternalLink from "../components/blog/ExternalLink.astro";
import InternalLink from "../components/blog/InternalLink.astro";
import Term from "../components/blog/Term.astro";

An <Acronym title="Model Context Protocol">MCP</Acronym> server answers with
JSON-RPC messages, a <Term title="A remote call encoded as a JSON object">remote procedure call</Term> format.
See <InternalLink slug="json-rpc">the JSON-RPC post</InternalLink> and
the <ExternalLink href="https://www.jsonrpc.org/specification" preview="The JSON-RPC 2.0 specification.">JSON-RPC 2.0 specification</ExternalLink>.
```

- **`ExternalLink`** (`href`, `preview`): opens in a new tab with the `↗` mark;
  the note names the site and gives the one-sentence `preview`.
- **`InternalLink`** (`slug`, optional `hash`): links to another post under the
  site base; the note shows that post's title and description. The build fails
  on an unknown slug, or when a published post links to a draft.
- **`Acronym`** and **`Term`** (`title`): an `<abbr>` or `<dfn>` with a dotted
  underline; the note is the expansion or the one-sentence definition.

Never start a line with one of them: keep at least one word before the tag on
the same line. Prettier's MDX parser reads a line that starts with a tag as a
block, splits the paragraph there and changes the rendered post. A line that
holds a component may run past 80 columns. The RSS feed turns them back into
Markdown links and text (`src/utils/mdxToMarkdown.ts`).

## The contract

These replace the artifact page contract. Every figure and widget follows them.

**Tokens only.** Take every color from `src/styles/base.css`:

| Token                       | Use                                                       |
| --------------------------- | --------------------------------------------------------- |
| `--text-color`              | Primary strokes and text (or `currentColor`)              |
| `--muted`                   | Secondary labels, axis ticks, captions                    |
| `--line`                    | Grid lines, borders, de-emphasized strokes                |
| `--surface`                 | Panel ground behind a figure (set by `Figure`)            |
| `--primary`                 | Page ground; fill for shapes that must mask a line behind |
| `--code-background`         | Box fills in diagrams                                     |
| `--contrast`                | The accent: one highlighted element per figure            |
| `--good`, `--warn`, `--bad` | Semantic state only (passes, degraded, fails)             |

Never hardcode a hex color in a figure and never add your own `[data-theme]` or
`prefers-color-scheme` block. The site's theme logic lives in `base.css` and
`Head.astro`; derived tokens follow it automatically. If a figure needs a color
the tokens do not cover, add a derived token to `base.css` with `color-mix()`
from the existing ones, next to the others.

**Fonts.** Geist Sans for text in figures (`var(--font-sans)`), Geist Mono for
labels, numbers, code and data (`var(--font-mono)`), Space Grotesk only for
headings. Do not load other fonts.

**Width.** The article column is at most about 740px wide. A figure must work at
360px. Dense SVGs get a `min-width` (at most 640px) so they scroll inside
`Figure` instead of shrinking their text below 10px. Nothing else may be wider
than the column.

**Complete at rest.** Everything the reader needs is in the server-rendered
HTML: the default state of a widget, the full diagram, all step text. Scripts
enhance, they never reveal. Never start content at `opacity: 0`.

**The prose stands alone.** The RSS feed (`src/pages/rss.xml.js`) renders the
raw post body with markdown-it, so components disappear from it. Every figure
must be introduced or summarized by the surrounding text; the figure adds
evidence to that text, it does not replace it.

**Motion.** Transitions of 150 to 300ms on state changes only. Wrap anything
larger in `@media (prefers-reduced-motion: no-preference)`, or disable it under
`reduce`. No looping ambient animation.

**Accessibility.** SVG gets `role="img"` and an `aria-label` that states the
claim. Controls are real `<button>` and `<input>` elements with labels, a
visible `:focus-visible` outline in `--contrast`, and ids. Live results use
`aria-live="polite"`.

**Dependencies.** Do not add npm packages for a figure. If a library is truly
needed, load it lazily from `cdn.jsdelivr.net/npm/` with an exact version, only
on the pages and at the moment it is used, like `PyodideRunner` and `Mermaid`
do. If a package must be installed anyway, ask the author first.

**Browser limits.** Wrap every `localStorage` access in try/catch and render
correctly without it. Use no `alert()`, `confirm()` or `prompt()`. Handle form
submissions in script with `preventDefault()`.

## Verification

Run from the repo root:

```sh
pnpm run check && pnpm run eslint && pnpm run format:check && pnpm run build
```

Fix every error. `pnpm run format::write` fixes formatting. Markdown line length
is 80 (markdownlint MD013) and new words may need `project-words.txt` for the
spell check.

Then look once: `pnpm run preview` (or `pnpm run dev`), open the post under
`/portfolio/blog/<slug>/`, and check it in both themes with the header toggle
and at phone width. Look for clipped labels, text that disappears in one theme,
a figure that scrolls the page sideways, and controls that do nothing. Make one
pass of fixes. Posts with `isDraft: true` are built under
`/portfolio/blog/drafs/<slug>/` instead.

Before committing, run the full list in AGENTS.md, "Checks".
