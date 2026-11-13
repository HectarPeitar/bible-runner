# Build the localized content table

Type: task
Status: open
Blocked by: 02

## Question

Produce the content table itself, in the stack the research ticket picks: 66 rows carrying order (1–66), testament, section, chapter count, aliases, and `names` keyed by locale (en, nl, ru, ka) — all four locales complete on every row, no row leaning on fallback.

Russian and Georgian verified by a native speaker, not by machine translation alone; the aliases are the ones people actually say, not synonyms invented for completeness.

Done when a small check asserts every row has all four locales non-empty, order is 1..66 with no gaps or duplicates, and every section's books are contiguous.

## Answer
