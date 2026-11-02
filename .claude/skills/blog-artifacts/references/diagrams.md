# Diagrams

Draw as the engineer who has to live with the decision, not as a decorator.

## What to draw

**The mechanism, not its name.** A box labeled "cache" says less than the prose.
The path a request takes through it, the two stores it sits between, and the
arrow that disappears when the cache is removed say what words cannot. Show the
parts the argument hinges on (the boundary crossed, the hop added, the data that
moves) and leave out the rest.

**Comparisons show the difference.** Two architectures side by side, a before
and an after, the one edge each option adds or removes. The reader should be
able to point at what they are choosing between. A box per option with nothing
connecting them to the system is a restated list, not a comparison.

**Complexity matches the stakes.** A one-hop question is three boxes. A
migration that reroutes writes through a queue needs the queue, the writer, the
reader and the ordering arrow. No forced minimalism and no inventory of the
whole system.

**Arrows carry labels.** An unlabeled arrow means "related somehow". `writes`,
`invalidates`, `polls every 30s` is information. Add a legend only when an
encoding (dashed, colored) repeats; otherwise label the mark itself.

## Inline SVG mechanics

Write the SVG in a post component (`src/blog/components/<slug>/Name.astro`), not
inline in MDX: `.astro` files take plain HTML attributes, get scoped styles, and
keep the MDX readable.

- **Size by `viewBox`.** Choose W and H for the content. Wide flows read left to
  right; layered stacks read top to bottom. `Figure` scales the SVG to the
  column. For dense drawings add `min-width` (at most 640px) so phones scroll
  inside the figure instead of shrinking text.
- **Theme through tokens.** Strokes and text use `currentColor` (which is
  `--text-color` inside `Figure`) or classes styled with the tokens. The one
  meaningful element takes `--contrast`. Never write a hex color.
- **Arrowheads** are a `<marker>` in `<defs>` whose path uses
  `fill="context-stroke"` so it takes the color of the line using it (a marker
  does not inherit `currentColor` from that line), or a small `<polygon>`. Ids
  inside a component repeat if the component appears twice on a page, so suffix
  them (see the example).
- **Legible text.** 11 to 13px at the drawn scale, Geist Mono, `text-anchor` for
  alignment, a word or three per label. Sentences belong in the caption.
- **A grid.** Pick a unit (for example 8px) and place boxes on it with even gaps
  and shared baselines. Eyeballed offsets read as noise.
- **One figure, one claim.** `Figure` provides `<figure>` and the caption. The
  `<svg>` gets `role="img"` and an `aria-label` carrying the same claim.
- **Self-contained.** No `<script>` or `<foreignObject>` inside the SVG. Style
  it from the component's `<style>` block. Long decorative path data means the
  drawing wants simplifying.
- **Stepper-ready.** If the diagram may be stepped through, wrap each step's
  shapes in `<g data-step="N">` and draw them in `currentColor`.

## Example component

```astro
---
/**
 * SessionLoss - The load balancer sends the second request to a replica
 * that never saw the session.
 */
const id = "session-loss";
---

<svg
  viewBox="0 0 600 200"
  role="img"
  aria-label="The second request reaches replica B, which has no session"
  class="diagram"
>
  <defs>
    <marker
      id={`${id}-arrow`}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"></path>
    </marker>
  </defs>

  <g data-step="1">
    <rect x="16" y="80" width="96" height="40" rx="4" class="box"></rect>
    <text x="64" y="100" class="label">
      client
    </text>
    <rect x="208" y="80" width="112" height="40" rx="4" class="box"></rect>
    <text x="264" y="100" class="label">
      load balancer
    </text>
    <line
      x1="112"
      y1="100"
      x2="204"
      y2="100"
      marker-end={`url(#${id}-arrow)`}
    ></line>
  </g>

  <g data-step="2">
    <rect x="464" y="24" width="120" height="40" rx="4" class="box"></rect>
    <text x="524" y="44" class="label">
      replica A
    </text>
    <line
      x1="320"
      y1="92"
      x2="460"
      y2="48"
      marker-end={`url(#${id}-arrow)`}
    ></line>
    <text x="344" y="46" class="edge">
      initialize
    </text>
  </g>

  <g data-step="3" class="accent">
    <rect x="464" y="136" width="120" height="40" rx="4" class="box"></rect>
    <text x="524" y="156" class="label">
      replica B
    </text>
    <line
      x1="320"
      y1="108"
      x2="460"
      y2="152"
      marker-end={`url(#${id}-arrow)`}
    ></line>
    <text x="330" y="176" class="edge">
      tools/call → 404
    </text>
  </g>
</svg>

<style>
  .diagram {
    min-width: 480px;
    color: var(--text-color);
    font-family: var(--font-mono);
  }

  line {
    stroke: currentColor;
    stroke-width: 1.5;
  }

  .box {
    fill: var(--code-background);
    stroke: currentColor;
    stroke-width: 1.5;
  }

  .label {
    fill: currentColor;
    font-size: 12px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .edge {
    fill: var(--muted);
    font-size: 11px;
  }

  .accent {
    color: var(--contrast);
  }
</style>
```

Inside a `Stepper`, the current step's group turns `--contrast` automatically,
so drop the static `.accent` class there.

## Mermaid

Use `<Mermaid>` for sequence diagrams, state machines and flowcharts whose
layout does not carry the argument. Keep node labels short, name edges
(`A -->|writes| B`), and keep to about a dozen nodes. The palette comes from the
site tokens; do not add `%%{init}%%` theme blocks. Pass the source as a template
literal so line breaks survive MDX.
