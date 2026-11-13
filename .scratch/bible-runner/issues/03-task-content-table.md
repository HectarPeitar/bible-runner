# Build the localized content table

Type: task
Status: open
Blocked by:

## Question

Produce the content table itself, in the stack the research ticket picks: 66 rows carrying order (1–66), testament, section, chapter count, and `names` keyed by locale (en, nl, ru, ka). **The NWT name is the only name the game ever shows**, so there is no alias column: one canonical name per book per locale, all four complete on every row, no row leaning on fallback. The four NWT name columns are already captured in [`research/nwt-book-names.md`](../../../research/nwt-book-names.md).

Build the *order and section* data from a public-domain Bible — **never transcribe jw.org**, whose Terms of Use forbid shipping site text in an application — and use jw.org only as a manual NWT spelling cross-check, with that provenance written down in the repo. 
Russian and Georgian transcribed from the research's primary-source tables and spot-checked by a native speaker — a transcription error in `ka` or `ru` teaches a false name, so the check is on the table as built, not a translation exercise. Record which section Hebrews sits in (Pauline, 14/7, is the default here) and keep it consistent — it only moves one boundary. Note that Acts and Revelation are single-book sections, so a section route on either is a one-gate lap; whoever builds the picker must decide whether those two are offered.

Never require or display abbreviations — no locale's set is safe and the Dutch list is incomplete.

Done when a small check asserts every row has all four locales non-empty, order is 1..66 with no gaps or duplicates, and every section's books are contiguous.

## Answer
