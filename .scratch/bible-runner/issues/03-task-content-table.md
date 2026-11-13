# Build the localized content table

Type: task
Status: resolved
Blocked by:

## Question

Produce the content table itself, in the stack the research ticket picks: 66 rows carrying order (1–66), testament, section, chapter count, and `names` keyed by locale (en, nl, ru, ka). **The NWT name is the only name the game ever shows**, so there is no alias column: one canonical name per book per locale, all four complete on every row, no row leaning on fallback. The four NWT name columns are already captured in [`research/nwt-book-names.md`](../../../research/nwt-book-names.md).

Build the *order and section* data from a public-domain Bible — **never transcribe jw.org**, whose Terms of Use forbid shipping site text in an application — and use jw.org only as a manual NWT spelling cross-check, with that provenance written down in the repo. 
Russian and Georgian transcribed from the research's primary-source tables and spot-checked by a native speaker — a transcription error in `ka` or `ru` teaches a false name, so the check is on the table as built, not a translation exercise. Record which section Hebrews sits in (Pauline, 14/7, is the default here) and keep it consistent — it only moves one boundary. Note that Acts and Revelation are single-book sections, so a section route on either is a one-gate lap; whoever builds the picker must decide whether those two are offered.

Never require or display abbreviations — no locale's set is safe and the Dutch list is incomplete.

Done when a small check asserts every row has all four locales non-empty, order is 1..66 with no gaps or duplicates, and every section's books are contiguous.

## Answer

Built: `src/content/books.json` (the 66 rows), `src/content/books.ts` (types only), `scripts/check-content.mjs` (the validator). `npm run check:content`:

```
content table ok: 66 books, 4 locales each, sections law=5 history=12 wisdom=5
major-prophets=5 minor-prophets=12 gospels=4 acts=1 pauline=14 general=7 revelation=1
```

**Data lives in JSON, deliberately.** This machine's Node is compiled without TypeScript support (`ERR_NO_TYPESCRIPT`), so a `.ts` table could not be executed or checked here — and an uncheckable table is worth nothing. JSON is imported natively by Vite and read by a zero-dependency checker, so the invariants can be run at any time by anyone. The types stayed in `books.ts`; the invariants live only in the checker, so there is one validator, not two.

**What the check enforces** — 66 rows; `order` is 1..66 with no gaps or reordering; every section is a known id and appears as one contiguous run in canonical order; all four locales non-empty on every row; no stray whitespace; chapters ≥ 1; and **no two books share a name within a locale**, which would otherwise put the answer on two gates at once. Verified the check *can* fail: injecting a duplicate Georgian name, a padded Dutch name and a section-order break produced exactly three errors and exit 1.

**Names** transcribed from the four NWT tables in [`research/nwt-book-names.md`](../../../research/nwt-book-names.md); order and section structure from the universal Protestant canon, per the sourcing rule — nothing transcribed from jw.org beyond the short names.

**Notes for later:**

- `Song of Solomon` is stored without the NWT contents table's parenthetical `(Canticles)`; the parenthetical is the NWT's own alternate, and we ship one name, so it was dropped. Say so if it should be on the gate.
- Chapter counts are carried but mode 1 never reads them. They follow English Bible numbering, so `Joel` is 3 and `Malachi` is 4 (Hebrew numbering differs).
- Hebrews sits in `pauline` (14/7 split).
- Russian and Georgian rows still want a native speaker's spot-check — a transcription slip there teaches a false name, and gate labels are the whole game.
