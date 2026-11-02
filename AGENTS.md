# About this repository

Yeison Liscano's portfolio and technical blog, an Astro site deployed to
<https://yeison-liscano.github.io/portfolio/>.

Any commit must be pushed to a different branch than `main`, and merged through
a pull request. The main branch is automatically deployed to GitHub Pages when a
pull request is merged.

## Enable development mode

```bash
  /nix/var/nix/profiles/default/bin/nix develop
```

The shell provides Node 26, pnpm, git and `python3` (for the skill scripts in
`.claude/skills/`).

## Repository layout

- Posts are flat files: `src/blog/<slug>.md` or `src/blog/<slug>.mdx`. The slug
  is the file name, and the post is served at `/portfolio/blog/<slug>/`.
- The frontmatter schema is in `src/content.config.ts`. Required: `title`,
  `pubDate`, `description`, `tags`. Optional: `lang` (`en`, `es` or `fr`,
  default `en`), `isDraft` (default `false`), `summary` (list of key takeaways),
  `updatedDate`, `readingTime`.
- `isDraft: true` keeps a post out of the listing, RSS and sitemap. It is
  previewed at `/portfolio/blog/drafs/<slug>/` ("drafs" is spelled that way in
  the code) and listed at `/portfolio/blog/drafts/`.
- Shared blog components live in `src/components/blog/`:
  - `Figure`: frames a diagram; `caption` is required; wide content scrolls
    inside the frame.
  - `Stepper`: walks through a diagram step by step. Pass `lang` for Spanish or
    French controls and mark SVG elements with `data-step="N"`.
  - `Mermaid` (`code`, `label`) and `Timeline`.
  - `ExternalLink` (`href`, `preview`): opens in a new tab and previews the site
    and the one-sentence `preview` on hover or focus.
  - `InternalLink` (`slug`, optional `hash`): links to another post and previews
    its title and description. The build fails on an unknown slug, or when a
    published post links to a draft.
  - `Acronym` and `Term` (`title`): show the expansion or definition on hover or
    focus. All four are built on `Tooltip`, need `.mdx`, and must not start a
    line (see Known traps).
- Components for a single post go in `src/blog/components/<post-slug>/`.
- Use the site's CSS variables in diagrams: `--text-color`, `--muted`, `--line`,
  `--surface`, `--code-background`, `--primary`, `--contrast` and `--cat-1` to
  `--cat-4`. Example: networking diagrams color layers this way: application
  `--contrast`, transport `--cat-2`, network `--cat-4`, link `--cat-1`, physical
  `--line`.
- The text column is about 680 px wide. Keep an SVG `viewBox` under about 800 px
  wide, or give it a `min-width` so it scrolls inside the `Figure` on phones.
- For external and internal references, use `ExternalLink` and `InternalLink`.
- When using acronyms use the `Acronym` component to provide a tooltip with the
  definition. Example:
  `<Acronym title="Representational State Transfer">REST</Acronym>`.
- When using technical terms, use the `Term` component to provide a tooltip with
  the definition. Example:
  `<Term title="A protocol for secure communication over a computer network">TLS</Term>`.

## Writing a post

- Posts are written in English, Spanish or French. Ask which language before
  writing unless the request already names it, and set `lang` to match.
- Before writing, list `src/blog` and read the related posts. Link to them with
  `/portfolio/blog/<slug>/` and don't repeat what they already cover.
- Look at the information provided by the user, understand images, files and
  information provided.
- Look for extra sources in which the topic is explained. Here, you must use the
  agent `information-retriever` to find reliable sources and summarize the most
  relevant information. Use only reliable sources, and cite them in the post.
- Structure every post this way:
  - Title: specific, plain words, key terms first, a clear payoff and one hint
    of tension.
  - First paragraph: the problem, the stakes and what the reader will get.
  - Headings: each one states a claim, so a scanner can follow the argument.
  - Body: a narrative spine (an incident, an investigation or a decision), with
    questions opened early and answered later.
  - Prose: short sentences, objective tone, no hype.
  - Visuals: diagrams, code and captures that explain something.
  - Ending: the payoff the title promised, plus one takeaway the reader can act
    on or share.
- Show a proposal with the title, first paragraph and headings before writing
  the full post. Wait for approval before continuing. Iterate on the proposal
  until it is approved. Then write the post in full.
- House conventions:
  - A keywords line before the opening paragraph: `Keywords:` in English,
    `Palabras clave:` in Spanish, `Mots-clés :` in French.
  - `## References` (or its translation) as the last section.
  - Three or four `summary` bullets in the frontmatter.
  - Reuse existing tags: `grep -h "^tags" src/blog/*`.
- Prefer real evidence: run the code, experiment or command and show its actual
  output. Say plainly when a lab differs from the scenario it stands for.

## Checks

### Pre commit verification

- Score each post with the blog-post-scorer agent before publishing. Publish
  only at 17/20 or more, with no gate (title, opening, payoff) at 0. Iterate on
  the fixes until the score is high enough. The agent returns a scorecard,
  showing the strengths and weaknesses of the post.

- Run the following commands before pushing:

```bash
  # Skip the Cypress binary if its download is blocked.
  CYPRESS_INSTALL_BINARY=0 pnpm install --frozen-lockfile
  # Generate types first to avoid false no-unsafe-* ESLint errors.
  pnpm exec astro sync
  pnpm exec astro check
  pnpm exec eslint .
  pnpm exec prettier --check . # run it after the last edit
  pnpm exec astro build

  # Spelling dictionaries are installed with the workspace above.
  pnpm exec cspell --no-progress <changed files>
```

#### Checking figures

- Build, run `pnpm exec astro preview` and look at every figure in light and
  dark themes before publishing.
- If no browser is installed, `puppeteer-core` with `@sparticuz/chromium` (both
  from npm) can screenshot each `figure.post-figure` element.

#### Commit

Once you all verification passed commit, do not add a `Claude-Session:` line to
commit messages.

### Open pull request

- If `gh pr create` fails because GraphQL is unavailable, open the pull request
  through the REST API:
  `gh api -X POST repos/yeison-liscano/portfolio/pulls --input pr.json`.

### Post-pull request verification

Verify pull request verification checks pass. The checks are:

- `portfolio-lint` (Nix): gitleaks, nixfmt and statix, shellcheck and shfmt,
  markdownlint on `src/blog`, and cspell on the files changed in the last
  commit.
- `eslint-prettier`: `pnpm install --frozen-lockfile`, `astro check`, `eslint`,
  `prettier --check .` and the Cypress lint.
- `cypress-run`: build and end-to-end tests.

Known traps:

- Prettier rewraps prose only in `.md` files. Wrap `.mdx` prose by hand at 80
  columns. A wrapped line that starts with a list marker, such as `1.` or a
  hyphen followed by a space, becomes a list.
- In `.mdx`, never start a line with an inline component (`ExternalLink`,
  `InternalLink`, `Acronym`, `Term`): Prettier reads it as a block, splits the
  paragraph and changes the rendered post. Keep a word before the tag on the
  same line; such a line may run past 80 columns.
- markdownlint only reads `.md` files, so nothing checks `.mdx` headings. Keep
  them under 80 characters yourself.
- cspell checks English, Spanish and French. Add recurring words to
  `project-words.txt`. For one-off tokens in an `.mdx` file, use
  `{/* cspell:ignore word */}` near the top.

## Git, pull requests and publishing

- You are done when a open pull request passes all checks.
