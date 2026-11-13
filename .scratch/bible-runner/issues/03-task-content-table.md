# Build the localized content table

Type: task
Status: open
Blocked by: 10

## Question

Produce the content table itself, in the stack the research ticket picks: 66 rows carrying order (1–66), testament, section, chapter count, aliases, and `names` keyed by locale (en, nl, ru, ka) — all four locales complete on every row, no row leaning on fallback.

Build the *order and section* data from a public-domain Bible — **never transcribe jw.org**, whose Terms of Use forbid shipping site text in an application — and use jw.org only as a manual NWT spelling cross-check, with that provenance written down in the repo. Ship the aliases the research marked mandatory (Russian and Georgian hard conflicts, `მეორე რჯული` above all) — they are what the after-miss card shows.

Russian and Georgian verified by a native speaker, not by machine translation alone; the aliases are the ones people actually say, not synonyms invented for completeness. Never require or display abbreviations — no locale's set is safe and the Dutch list is incomplete.

Done when a small check asserts every row has all four locales non-empty, order is 1..66 with no gaps or duplicates, and every section's books are contiguous.

## Answer
