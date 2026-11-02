# Interactivity

An artifact runs its inline script once on its own page. A post runs inside
Astro, which changes how scripts behave.

## How Astro treats component scripts

- A plain `<script>` in an `.astro` component is processed as TypeScript,
  bundled, and included **once per page**, however many times the component
  appears. Code that grabs "the" element with `document.querySelector` breaks on
  the second instance.
- `<script is:inline>` or `define:vars` skip bundling and repeat per instance.
  Avoid them for widgets.
- `<style>` is scoped to the component's own markup. Markup that arrives through
  `<slot />`, or that a script creates, needs `:global(...)` nested under a
  scoped selector, like `Stepper` does.

## The pattern: custom elements

Wrap each widget in a custom element and put its behavior in the class. The
browser calls `connectedCallback` for every instance, so multiple instances and
later-added markup just work.

```astro
<post-slug-thing data-initial="5">
  <!-- Server-rendered resting state: complete without JS. -->
</post-slug-thing>

<script>
  class PostSlugThing extends HTMLElement {
    connectedCallback() {
      this.addEventListener("input", () => this.update());
    }
    update() {
      /* read inputs inside `this`, write outputs inside `this` */
    }
  }
  customElements.define("post-slug-thing", PostSlugThing);
</script>
```

- Name elements `<post-slug>-<thing>` (they need a hyphen and must be unique
  site-wide). Shared components use the `blog-` prefix.
- Pass configuration through `data-*` attributes; read it with `this.dataset`.
- Scope every query to `this`.
- Delegate events on the element (one listener for all its buttons or inputs).

## Complete at rest

Compute the default state on the server with the same function the client uses,
and render it into the HTML (see `templates/Explorable.astro`). Readers without
JavaScript, RSS previews, search engines and a reader who never touches the
control all see a correct figure. Controls that only work with JavaScript start
`hidden` and the script reveals them.

## State

- Widget state lives in the element. Most widgets need no persistence.
- `localStorage` only for per-reader conveniences (a remembered choice). Wrap
  every read and write in try/catch; it throws in private windows and when site
  data is blocked. The site already stores `theme` there; namespace keys as
  `post:<slug>:<name>`.
- There is no backend: GitHub Pages serves static files. Anything shared between
  readers is out of scope.

## Reacting to the theme

Figures styled with tokens need nothing: the colors update when `data-theme`
changes. Canvas drawings and third-party renderers that bake colors in must
redraw. Read colors with
`getComputedStyle(document.documentElement).getPropertyValue("--token")` and
redraw from a `MutationObserver` on `document.documentElement` watching
`data-theme`, plus a `prefers-color-scheme` change listener. `Mermaid.astro`
shows the whole pattern. Derived tokens come back as unresolved `color-mix()`
text, so give canvas and libraries the literal hex tokens (`--primary`,
`--text-color`, `--neutral`, `--contrast`, `--code-background`).

## Heavy things

- Canvas or WebGL for generative or high-count drawings (particles, grids of
  thousands of cells). Size the canvas by `devicePixelRatio` and redraw on
  resize with a `ResizeObserver`.
- Libraries load lazily from a pinned `cdn.jsdelivr.net/npm/<pkg>@<exact>/...`
  build, triggered by the first use or an `IntersectionObserver`, and cached in
  a module-level promise. Load them through an injected `<script>` element (see
  `Mermaid.astro` for ESM, `PyodideRunner.astro` for a classic script), never a
  dynamic `import()` in a component script: Astro inlines small scripts into the
  HTML, where Vite leaves its `__VITE_PRELOAD__` placeholder unfilled and the
  import throws `ReferenceError` at runtime. The build does not fail, so check
  the browser console.
- Animation loops use `requestAnimationFrame`, stop when the element leaves the
  viewport, and do not start under `prefers-reduced-motion: reduce`.

## Accessibility

- Buttons are `<button type="button">`; sliders are `<input type="range">` with
  a `<label for>` and an `<output>` showing the value.
- Every control is reachable and operable with the keyboard, with a visible
  `:focus-visible` outline in `--contrast`.
- Results that change announce through `aria-live="polite"`.
- Disabled states use the `disabled` attribute, not only styling.

## Runnable code

Fenced `python` blocks automatically get a Run button (Pyodide, loaded on first
click) and a pydantic.run link from `components/PyodideRunner.astro`. Make
examples self-contained: standard library only, `print` the result, and finish
in under a second. Packages that are not in Pyodide will fail.

## MDX gotchas

When converting a `.md` post or writing `.mdx`:

- `{` and `<` in prose are parsed as JSX. Escape them (`\{`, `&lt;`) or put them
  in inline code.
- HTML comments `<!-- -->` are invalid; use `{/* comment */}`.
- Imports go right after the frontmatter. Relative paths from `src/blog/`:
  `../components/blog/Figure.astro`, `./components/<slug>/Name.astro`.
- Leave a blank line between a JSX block and surrounding markdown, or the
  markdown inside may not render.
- Keep `.astro` markup (SVG, widgets) out of the MDX file; MDX treats attributes
  as JSX.
- Prettier formats `.mdx` too; run `npm run format::write` after editing.
- Angle-bracket autolinks (`<https://example.com>`) are invalid; write
  `[https://example.com](https://example.com)`.
- LaTeX (`$$ \text{...} $$`) breaks on its braces, and the site has no math
  plugin, so it never rendered anyway. Write the formula in a `text` code block.

## Astro template gotchas

- Inside `{...}` expressions in the template, the compiler can read `<` as the
  start of a tag and fail with "Unable to assign attributes when using <>
  Fragment shorthand syntax". Flip the comparison (`hi >= i`, not `i <= hi`) or
  compute the value in the frontmatter. `<script>` blocks are unaffected.
- Text such as `lo={value}` inside an element is also misread. Build the string
  as one expression: ``{`lo=${value}`}``.

## Lint and types

- eslint's MDX parser needs `remark-frontmatter` in a `.remarkrc` to skip YAML
  frontmatter. Without it, a `<` or `{` in a frontmatter value (for example
  `left <= right` or a JSON example) fails to parse.
- `npm run eslint` checks `.astro` and `.mdx`. Script blocks are TypeScript:
  type `querySelector` results (`querySelector<HTMLInputElement>`), handle
  `null`, and do not leave `any`.
- `npm run check` runs `astro check` with strict TypeScript over the component
  props.
- No `console.log` left behind; use `console.error` with a `[component]` prefix
  for real failures.
