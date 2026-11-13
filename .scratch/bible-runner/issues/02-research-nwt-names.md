# NWT book names per locale

Type: research
Status: resolved
Blocked by:

## Question

What is the New World Translation's own ordered list of the 66 books, with its exact display names in **English, Dutch, Russian, and Georgian**? Where does that list come from authoritatively (the jw.org locale sites, an NWT table of contents), and is bundling *only the names and order* legally safe given Watch Tower's copyright? Names of books on a canonical list are usually not protectable while scripture text certainly is — confirm or correct that, don't assume it.

Per locale capture: the 66 names in NWT spelling and order, the widely used alternate names people actually say (candidates for aliases), numbering and abbreviation quirks (`1 Samuel` vs `I Samuel`, `Psalms` vs `Psalm`, `Song of Solomon` variants), and every place the NWT name differs from the ecumenical/common name — a player who knows their own language's common name and loses because the game used a different one is the worst outcome this content file can produce.

Also note which script each locale needs (Latin, Cyrillic, Georgian Mkhedruli) and whether one webfont family covers all three with proper fallback (Noto Sans + Noto Sans Georgian, or similar), since that constrains the stack ticket.

## Answer

Full tables and citations: [`research/nwt-book-names.md`](../../../research/nwt-book-names.md). All 66 names captured for en / nl / ru / ka from the NWT's own per-locale "Names and Order of the Books" (WOL docid 1001061103), cross-checked against a second primary source where one existed.

**The names diverge from what speakers of the same language say.** English: identical to the common list, 0 conflicts. Dutch: 1 hard conflict (`Rechters` vs `Richteren`) plus four spelling splits that depend on which Dutch Bible the player grew up with (`Mattheüs`/`Matteüs`, `Korinthiërs`/`Korintiërs`, `Thessalonicenzen`/`Tessalonicenzen`, `Timotheüs`/`Timoteüs`) and heavy diacritics. Russian: 6 hard conflicts (`1/2 Самуила` vs `1/2 Царств`, `1/2 Царей` vs `3/4 Царств`, `Летопись` vs `Паралипоменон`, `Псалмы` vs `Псалтирь`, `Песня Соломона` vs `Песнь Песней`, `Судей` vs `Судьи`) plus a systematic dropped `От`/`К` across all 21 New Testament books. Georgian: roughly 29 conflicts — NWT uses modern `-ები` plurals where tradition uses `-ნი`/`-თა`, renumbers Kings and Chronicles, and calls Deuteronomy **`კანონი`** where every other Georgian Bible says **`მეორე რჯული`**.

**Sharpening the ticket's own premise:** aliases were asked for as if the game might accept a typed name. It will not — Book Order is gate *choice*, so there is nothing to accept. Aliases are display material only. Which name a gate *prints* is therefore a teaching decision, not a matching policy, and it is now its own ticket.

**Copyright: names are clear, sourcing is not.** Book names, titles, and "mere listing of contents" are outside copyright (37 CFR § 202.1(a)); facts are not copyrightable and the compilation is thin (*Feist*, 499 U.S. 340); and this exact 66-book order is the universal Protestant canon, not Watch Tower's selection. **But** jw.org's Terms of Use separately forbid distributing text from that site "with or as part of any software application" and forbid scrape-style collection tools. Contract beats the meritorious copyright argument in practice: **derive the order from a public-domain Bible, never transcribe jw.org**, and use jw.org only as a manual cross-check of spelling, with the provenance decision written down in the repo. No case law specific to book-name lists was found; no scripture text appears anywhere.

**Fonts, settled:** no single Noto file covers the requirement — Noto Sans carries Latin + Cyrillic + Greek and **no Georgian**; Noto Sans Georgian carries Georgian + Georgian Extended (Mtavruli) and **no Latin or Cyrillic**. Both are needed, with per-glyph fallback, because a Georgian label like `1 სამუელი` mixes ASCII digits with Mkhedruli in one string. Subset with `unicode-range` so Georgian downloads only for `ka`, ship the OFL licence files, and never `text-transform: uppercase` Georgian names.

**Unverified, do not guess:** the Georgian *common* names come from secondary sources only (no Bible Society page reached) and need a Georgian speaker to confirm before shipping `ka`; Dutch abbreviations are incomplete and should not ship; Russian common names are stable across four independent sites but not from an official publisher. This is a research reading, not legal advice.
