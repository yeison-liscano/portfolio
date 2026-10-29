# CLAUDE.md

Guidance for Claude in this repository: Yeison Liscano's portfolio and technical
blog, an Astro site deployed to <https://yeison-liscano.github.io/portfolio/>.

<!-- cspell:ignore drafs sparticuz -->

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
- Components for a single post go in `src/blog/components/<post-slug>/`.
- Use the site's CSS variables in diagrams: `--text-color`, `--muted`, `--line`,
  `--surface`, `--code-background`, `--primary`, `--contrast` and `--cat-1` to
  `--cat-4`. Networking diagrams color layers this way: application
  `--contrast`, transport `--cat-2`, network `--cat-4`, link `--cat-1`, physical
  `--line`.
- The text column is about 680 px wide. Keep an SVG `viewBox` under about 800 px
  wide, or give it a `min-width` so it scrolls inside the `Figure` on phones.

## Writing a post

- Posts are written in English, Spanish or French. Ask which language before
  writing unless the request already names it, and set `lang` to match.
- Before writing, list `src/blog` and read the related posts. Link to them with
  `/portfolio/blog/<slug>/` and don't repeat what they already cover.
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
- House conventions:
  - A keywords line before the opening paragraph: `Keywords:` in English,
    `Palabras clave:` in Spanish, `Mots-clés :` in French.
  - `## References` (or its translation) as the last section.
  - Three or four `summary` bullets in the frontmatter.
  - Reuse existing tags: `grep -h "^tags" src/blog/*`.
- Prefer real evidence: run the code, experiment or command and show its actual
  output. Say plainly when a lab differs from the scenario it stands for.
- Score each post with the blog-post-scorer skill before publishing. Publish
  only at 17/20 or more, with no gate (title, opening, payoff) at 0.

## Checks

Every pull request runs `.github/workflows/dev.yml`:

- `portfolio-lint` (Nix): gitleaks, nixfmt and statix, shellcheck and shfmt,
  markdownlint on `src/blog`, and cspell on the files changed in the last
  commit.
- `eslint-prettier`: `npm ci`, `astro check`, `eslint`, `prettier --check .` and
  the Cypress lint.
- `cypress-run`: build and end-to-end tests.

Run the same checks locally before pushing:

```bash
CYPRESS_INSTALL_BINARY=0 npm ci   # skip the Cypress binary if its download is blocked
npx astro sync                    # generate types first, or eslint reports false no-unsafe-* errors
npx astro check
npx eslint .
npx prettier --check .            # run it after the last edit
npx astro build

# Spelling: .cspell.json loads its dictionaries from nix/pkgs/portfolio-spell
npm install --no-save --prefix nix/pkgs/portfolio-spell \
  @cspell/dict-es-es@^3.0.8 @cspell/dict-fr-fr@^2.3.2
npx cspell --no-progress <changed files>
```

Known traps:

- Prettier rewraps prose only in `.md` files. Wrap `.mdx` prose by hand at 80
  columns. A wrapped line that starts with a list marker, such as `1.` or a
  hyphen followed by a space, becomes a list.
- markdownlint only reads `.md` files, so nothing checks `.mdx` headings. Keep
  them under 80 characters yourself.
- cspell checks English, Spanish and French. Add recurring words to
  `project-words.txt`. For one-off tokens in an `.mdx` file, use
  `{/* cspell:ignore word */}` near the top.

## Git, pull requests and publishing

- A push to `main` deploys the site to GitHub Pages
  (`.github/workflows/deploy.yml`), so merging a pull request publishes it.
- Work on a branch, open a pull request to `main` and wait until every check
  passes.
- Ask before merging, unless the user has already said to merge.
- Pull request titles and commit subjects use sentence case and the imperative
  mood: "Add …", "Fix …".
- Do not add a `Claude-Session:` line to commit messages.
- If `gh pr create` fails because GraphQL is unavailable, open the pull request
  through the REST API:
  `gh api -X POST repos/yeison-liscano/portfolio/pulls --input pr.json`.

## Checking figures

- Build, run `npx astro preview` and look at every figure in light and dark
  themes before publishing.
- If no browser is installed, `puppeteer-core` with `@sparticuz/chromium` (both
  from npm) can screenshot each `figure.post-figure` element.
