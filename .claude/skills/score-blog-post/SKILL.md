---
name: "score-blog-post"
description:
  "Score a blog post or draft against the 10-criterion reader-engagement rubric
  and return scores, gate check, verdict and prioritized fixes. Use when asked
  to score, grade or review a blog post."
argument-hint: post-path
---

# Blog post scorer

Score a post on whether it catches a reader and keeps them reading to the end.
Output a scorecard, a verdict, and the few fixes that matter most. Score the
page as written, never the author's intent.

## 1. Get the post

- Read the post file named in the request, usually `src/blog/<slug>.md` or
  `src/blog/<slug>.mdx`.

## 2. Load the rubric

Read the canonical rubric,
`.claude/skills/score-blog-post/references/evaluation-rubric.md`. It holds the
criteria, the "Strong" column, the quick tests, the score bands and the fix
order.

## 3. Measure what can be measured

Run the metrics script from the repository root:
`python3 -I .claude/skills/score-blog-post/scripts/score_metrics.py src/blog/<slug>.mdx`.
`python3` comes from the Nix dev shell (`nix develop`). The script handles
markdown and MDX: frontmatter title, code blocks excluded from prose, list items
counted as separate sentences, the keywords line skipped when it finds the
opening paragraph.

The parser is rough: abbreviations like "e.g." can split sentences. Sanity-check
any odd number against the text. If the post is not markdown (HTML page, PDF),
skip the script and measure by reading.

## 4. Score each criterion

Score 0, 1 or 2 per criterion. Then:

- Read the whole post before scoring anything.
- Every score cites evidence: a short quote (under 15 words) from the post, or a
  metric from step 3.
- A 2 is earned, not the default. Between two scores, pick the lower one and say
  what would raise it.
- Judge jargon against the intended reader. For a technical blog, practitioners
  know OAuth or PKCE; terms only the author's team uses must be defined.
- Code blocks, diagrams, charts and annotated screenshots all count as
  information-carrying visuals. A decorative or stock image counts against
  criterion 8.
- A short post can score 2 on length. Judge whether each section earns its
  place, not the word count.
- Criterion 10 needs the whole post: compare what the title and opening promise
  with what the body delivers.

Then apply the gates (1, 2, 10), total the score, and pick the band.

## 5. Report

Reply in this shape:

**Score: 14/20, Revise.** Gates: Title 2, Opening 1, Payoff 2.

| #   | Criterion | Score | Evidence                                                    | Fix  |
| --- | --------- | ----- | ----------------------------------------------------------- | ---- |
| 1   | Title     | 2     | "OAuth redirect URIs leak tokens…": topic in first 11 chars | none |
| …   | …         | …     | …                                                           | …    |

**Fix first** (top three, in the fix order): name the problem, then give a
concrete rewrite.

- Title below 2: offer 2 or 3 alternative titles.
- Opening below 2: a rewritten first paragraph.
- Headings below 2: each weak heading rewritten as a claim.
- Long sentences: split the worst one or two as examples.

**Metrics:** one line from step 3 (words, minutes, average sentence, sentences
over 40, longest paragraph, images, code blocks).

Rules for fixes:

- Use only facts already in the post. Never invent numbers, results or
  anecdotes.
- Keep the author's voice and terms.
- Don't rewrite the whole post unless asked. Offer to apply the fixes instead.
- Save scores to a file or the rubric doc only when the user asks.

Why each criterion matters, for explaining a score:

- 1: clearer and simpler headlines draw more clicks; a middle amount of detail
  beats both vague and fully revealing headlines; the first two words carry the
  most weight.
- 2: about 55% of pageviews get under 15 seconds of attention, and about half of
  readers drop off at the fold.
- 3–4: about 79% of users scan new pages; concise, scannable, objective writing
  raised measured usability 124%.
- 5: comprehension falls as sentences lengthen (directional evidence).
- 6: stories are linked to better recall and comprehension and pull readers
  toward the resolution.
- 7: surprising, useful, high-arousal content is shared more.
- 8: users study informative images and ignore decorative ones.
- 9: on Medium, 7-minute posts got the most total reading time, but quality beat
  length.
- 10: a promise the post doesn't keep leaves readers feeling cheated.
