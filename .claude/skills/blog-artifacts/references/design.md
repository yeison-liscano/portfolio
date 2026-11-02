# Design rules for figures in posts

In an artifact, each page gets its own visual identity. On this blog, the site
already has one. The figure's job is to look like it belongs to the post while
making its one point clearly. Precedence: the user's own words, then the site's
system (`base.css`, existing components), then these rules.

## Treatment

Most figures are utilitarian: a diagram, a chart, a small tool. Make them exact,
with real hierarchy, even spacing and deliberate color, and leave out
flourishes. An editorial treatment (a large opening visual, orchestrated motion)
fits only when the user asks for a showcase piece, and even then it stays inside
the post column and the site's type and palette.

## Ground it in the subject

Every figure includes at least one detail only its subject would have: real
units and scales (ms, req/s, bytes, %, $), real protocol method names
(`tools/list`, `SYN`/`ACK`), real file or function names from the post's code.
Use the post's real numbers and names, never placeholder data. When a figure
shows example values, label them as examples.

## Color

- One accent per figure: `--contrast` marks the element the argument hinges on
  (the lost request, the chosen option, the final value). Everything else is
  `--text-color`, `--muted` or `--line`.
- Semantic tokens (`--good`, `--warn`, `--bad`) encode state and are not
  accents. Use them only when the figure is about pass, degraded or fail.
- Fill boxes with `--code-background` or leave them unfilled. Borders in
  `--line` for secondary shapes, `--text-color` for primary ones.
- Test both themes. The dark palette uses a yellow accent on navy, and the light
  palettes use purple or ochre, so an element that relies on "the yellow one" in
  the prose breaks in light mode. Refer to it by role ("the highlighted
  request"), not by hue.

## Type

- Labels in figures: Geist Mono, 11 to 13px at the drawn scale.
- Running text in widgets: Geist Sans at the body size, lines near 65
  characters.
- Numbers that line up in columns or change live:
  `font-variant-numeric: tabular-nums`.
- Uppercase labels get `letter-spacing: 0.05em`. Use them sparingly.

## Layout

- Lay out groups with flex or grid and `gap`, not per-element margins.
- Controls stack to one column below about 480px.
- Repeated elements share edges, baselines and padding. Put the same kind of
  element in the same place each time.
- Use a border or panel only to set something apart. `Figure` already provides
  the panel; do not nest cards inside it.

## Charts

- One scale for marks, ticks and labels. Every tick label names a value the axis
  reaches. Start bar charts at zero.
- Leave margin in the `viewBox` for the outermost labels. Give every shape an
  explicit fill or `fill="none"`.
- Grid lines in `--line`, ticks in `--muted`, data in `--muted` or
  `--text-color`, the point of the chart in `--contrast`.
- Label values directly on the marks when there are fewer than about eight; skip
  the legend when direct labels do the job.

## Structure is information

Numbered markers, eyebrows and dividers must encode something true. Number steps
only when order matters (a handshake, a pipeline). Do not number parallel
options.

## Avoid the generated look

No emoji as section markers, no gradient panels, no glow, no everything-
centered layouts, no identical rounded shadowed cards, no accent rail on the
left of a card. The site's own blockquote already uses a left border; do not
imitate it for figures.

## Copy

- The caption states the claim: "The second request lands on a replica that
  never saw the session", not "Diagram of the architecture".
- Controls say exactly what they do: "Next", "Reset", "Run". Status text says
  what happened: "Step 2 of 5".
- Errors say what went wrong and how to fix it, without apology.
- Short, direct sentences. Name things the way the reader knows them. Avoid
  em-dash asides, "not X, but Y" framing and stock phrases.
- Match the post's language. Several posts are in Spanish or French; their
  figure labels, captions and controls are too.
