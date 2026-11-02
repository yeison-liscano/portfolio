import re, sys

raw = open(sys.argv[1], encoding="utf-8").read()

title = None
fm = re.match(r"^---\s*\n(.*?)\n---\s*\n", raw, flags=re.S)
if fm:
    t = re.search(r"^title:\s*[\"']?(.*?)[\"']?\s*$", fm.group(1), flags=re.M)
    title = t.group(1) if t else None
    raw = raw[fm.end():]

code_blocks = len(re.findall(r"^\s*```", raw, flags=re.M)) // 2
prose = re.sub(r"^\s*```.*?^\s*```[^\n]*", "", raw, flags=re.S | re.M)
images = re.findall(r"!\[[^\]]*\]\([^)]*\)|<img\b[^>]*>", prose)
headings = re.findall(r"^(#{1,6})\s+(.+)$", prose, flags=re.M)
if not title:
    h1 = [h for lvl, h in headings if lvl == "#"]
    title = h1[0] if h1 else None

body = re.sub(r"^#{1,6}\s+.*$", "", prose, flags=re.M)
body = re.sub(r"!\[[^\]]*\]\([^)]*\)|<img\b[^>]*>", "", body)
body = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", body)
body = re.sub(r"`[^`]*`", "code", body)
body = re.sub(r"^\s*\|.*$", "", body, flags=re.M)                  # tables
body = re.sub(r"^\s*(import|export)\s.*$", "", body, flags=re.M)   # MDX
body = re.sub(r"\{/\*.*?\*/\}", "", body, flags=re.S)              # MDX comments
body = re.sub(r"<[^>]+>", "", body)                                # HTML/JSX tags

WORD = r"\b\w[\w'’-]*"
paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
units = []
for p in paras:
    lines = p.splitlines()
    if any(re.match(r"\s*([-*+]|\d+\.)\s", l) for l in lines):
        units += [re.sub(r"^\s*([-*+]|\d+\.)\s+", "", l) for l in lines if l.strip()]
    else:
        units.append(" ".join(l.strip() for l in lines))
sentences = [s for u in units for s in re.split(r"(?<=[.!?])\s+", u) if re.search(WORD, s)]
slen = [len(re.findall(WORD, s)) for s in sentences]
plen = [len(re.findall(WORD, p)) for p in paras]
words = sum(plen)
avg = sum(slen) / len(slen) if slen else 0
# The house keywords line comes before the opening paragraph; skip it.
KEYWORDS = re.compile(r"^\W*(Keywords|Palabras clave|Mots-clés)\s*:", re.I)
opening = next((p for p in paras if not KEYWORDS.match(p)), None)

print(f"Title: {title!r}")
print(f"First 11 chars: {title[:11]!r}" if title else "First 11 chars: (no title found)")
print(f"Prose words (excl. code): {words}  |  reading time ~{max(1, round(words / 275))} min at 275 wpm")
print(f"Sentences: {len(slen)}  |  avg {avg:.1f} words  |  over 25: {sum(l > 25 for l in slen)}  |  over 40: {sum(l > 40 for l in slen)}")
for n, s in sorted(zip(slen, sentences), reverse=True)[:5]:
    print(f"  {n:>3}w  {' '.join(s.split()[:10])}…")
print(f"Paragraphs: {len(plen)}  |  longest {max(plen, default=0)} words  |  over 150 words: {sum(l > 150 for l in plen)}")
print(f"Opening paragraph: {' '.join(opening.split()[:60]) if opening else '(none)'}")
print(f"Headings ({len(headings)}):")
for lvl, h in headings:
    print(f"  {'  ' * (len(lvl) - 1)}{lvl} {h}")
print(f"Images: {len(images)}  |  Code blocks: {code_blocks}")
