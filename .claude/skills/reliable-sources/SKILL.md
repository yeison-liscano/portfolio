---
name: "reliable-sources"
description:
  "Judge whether a web source is reliable enough to cite in a post on this blog,
  and list the most reliable sources for a topic. Use when finding, vetting or
  citing sources for a post."
argument-hint: topic
---

# Reliable sources

Evaluate the reliability of sources based on author credibility, publication
reputation, citation frequency and recency. Only sources that pass may be
summarized, quoted or cited in a post.

## Criteria

A source is reliable when it meets these criteria:

1. **Author Credibility**: The author is an expert in the field, with relevant
   qualifications and a history of accurate publications.
2. **Publication Reputation**: The source is published by a reputable
   organization, academic institution, or recognized media outlet known for
   fact-checking and editorial standards.
3. **Citation Frequency**: The source is frequently cited by other credible
   sources, indicating its influence and acceptance in the field.
4. **Recency of Information**: The information is up-to-date and reflects the
   latest research or developments in the topic area. For foundational work, the
   original paper or specification still counts when nothing has replaced it;
   check that it is not obsoleted (for example, an RFC's "Obsoleted by").

Prefer primary sources: specifications and RFCs, official documentation,
standards bodies and peer-reviewed papers. Use secondary sources to explain a
primary one, not to replace it.

## Steps

1. Search the topic and its key terms. Start from any URLs the request gives,
   but vet them like any other candidate.
2. Open each candidate and check it against the four criteria. Never list a
   source you have not opened.
3. Drop the ones that fail, and say which criterion they failed if the caller
   suggested them.

## Output Format

Return a list of reliable sources in the following format:

- **Source Title**: Summary of the source's content, max 1000 words. Author or
  publisher, date, and the criteria it meets. [Link to Source](URL)
