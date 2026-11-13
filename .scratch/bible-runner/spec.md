Status: ready-for-agent
Type: spec
Effort: Book Order (`.scratch/bible-runner/map.md`)

# Spec: Bible Runner — Book Order

## Problem Statement

Someone who reads the Bible in the New World Translation can find any verse by chapter and verse number, but cannot say what comes after Haggai. The book order is the one piece of Bible knowledge with no index: you either have it memorised or you look at the table of contents every time. Flashcard apps teach it, badly — they are boring, they are quizzing, and nobody opens them twice.

The names make it worse for non-English readers. A Dutch player who learned `Richteren` meets `Rechters` in their own Bible's contents page; a Russian player who learned `3 Царств` meets `1 Царей`; a Georgian player who learned `მეორე რჯული` meets `კანონი`. Study material never covers this, so the names they mistrust are the names their own Bible prints.

## Solution

A browser game called **Book Order**, the first Mode on a small platform called Bible Runner. A Run is a travelling choice: three Gates appear, each printing a Book name, and exactly one is the next Book in canon order. Pick it and the Run advances, faster. Pick wrong and the Gate **Bounces** — the row stays, the same three choices return, and the correct Gate is marked so the Run can continue at the cost of a Life and the Speed that had been built. Three Lives, then the Run ends and the Books that were missed are listed in order.

It teaches by construction rather than by quizzing: a Bounce means no Book can ever be skipped, so the order a player has travelled is always correct, and the miss is corrected on the spot rather than at the end.

Two Routes reach the same ruleset: a **section route** loops one Course (a contiguous group of Sections) for drilling, and a **canon route** travels the whole canon from any of the ten Sections and ends when the player runs out of Lives. A clean route earns a **Start boost**, offered on the next Run of that route.

Every Book name is the one the player's own Bible prints. All 66 are the New World Translation's, in English, Dutch, Russian and Georgian, chosen with a Locale picker whose default is the player's browser language. Routes are labelled by Book range (`Genesis–Song of Solomon`, `Isaiah–Malachi`), never by an invented category name.

Scores live on six local boards — one per Route — and are for a shared computer: a friend who plays gets a name on the board, remembered for next time. Nothing leaves the device.

## User Stories

**Playing**
1. As a Bible reader, I want to open a web address and start playing with no install, no account and no sign-in, so that curiosity is enough.
2. As a player, I want to see three Gates with Book names and pick the one that comes next, so that knowing the order is the whole game.
3. As a player, I want exactly one of the three Gates to be correct, so that a wrong answer is my knowledge failing, not the game being unfair.
4. As a player, I want a correct pick to move me forward and raise my Speed, so that mastery produces a visibly faster Run.
5. As a player, I want Speed to climb toward a ceiling rather than forever, so that the game stays playable instead of becoming a blur.
6. As a player, I want a wrong pick to cost a Life, so that three mistakes end the Run and a Run has a shape.
7. As a player, I want a wrong pick to leave the row in place and mark the correct Gate, so that I learn the pair I just missed instead of being punished and moved on.
8. As a player, I want to tap the marked Gate to continue, so that the Run resumes and the correction is deliberate rather than automatic.
9. As a player, I want the marked Gate's points to be gone as well as a Life, so that a Bounce is a real cost but not a second, hidden punishment.
10. As a player, I want the Run to end at three Lives with the missed Books listed in canonical order, so that the Run leaves me with a list I can reread.

**Routes**
11. As a player, I want to choose either a Course drill or the whole canon before a Run, so that I can fit the game to the five minutes I have.
12. As a player looping a Course, I want to be sent back to its first Book after its last, so that drilling never ends in a dead stop.
13. As a player on a canon route, I want to start at any of the ten Sections, so that I can drill the part of the canon I keep confusing.
14. As a player reaching Revelation on a canon route, I want to choose between finishing there and wrapping into Genesis, so that an endless Run is my choice and not a trap.
15. As a player who finishes at Revelation, I want a "canon complete" marker rather than a score, so that the achievement is not ranked against endless Runs.
16. As a player, I want the choice of finishing or wrapping to be offered once per pass, so that the endless mode is reachable without restarting.
17. As a player who completed a Route with no Bounces, I want a Start boost offered on my next Run of that Route, so that skill compounds instead of only being scored.

**Labels and language**
18. As a player, I want every Gate to print the Book name my own Bible prints, so that the game teaches the vocabulary I will actually meet.
19. As a Dutch player, I want `Rechters`, `Samuël` and `Efeziërs` exactly as my Bible has them, so that the game never teaches a spelling that appears nowhere.
20. As a Russian player, I want `1 Самуила`, `1 Царей` and `Псалмы`, so that the game is about the order and not a second, conflicting vocabulary.
21. As a Georgian player, I want `კანონი`, `მსაჯულები` and `რომაელები`, so that the names in the game match the names on the page I look things up in.
22. As a player, I want to choose my language once and have the whole game, including route labels, follow it, so that nothing mixes two languages on one screen.
23. As a player whose language is not finished, I want not to be offered it, so that I never meet a half-translated game.
24. As a player, I want route labels to read `Genesis–Malachi` rather than a category I have never seen in a Bible, so that every word on screen is a Book name.

**Scoreboard**
25. As a player, I want my score to be `100 × Speed` at each Gate, so that a fast clean Run beats a slow long one.
26. As a player whose Run lands in the top ten, I want to enter a name and see it on the board, so that the Run is recorded.
27. As a player whose Run does not qualify, I want to see my score without a name prompt, so that a bad Run is not a form to fill in.
28. As a player, I want my last name pre-filled next time, so that playing again is one click.
29. As a friend playing on someone else's computer, I want to type my own name and have it stick for my next turn, so that the board says whose score is whose.
30. As a player, I want the top three on the result screen and the whole board behind one button, so that the result is not a wall of numbers.
31. As a player, I want equal scores ranked by who got there first, so that the ranking is never arbitrary.
32. As a player, I want a score that qualifies into a full board to push out the lowest, so that the board is always the best ten.
33. As a player, I want a separate board for each Route, so that a Course lap and a whole-canon Run are never compared.

**Trust**
34. As a player, I want the game to work with storage blocked, so that private browsing is not a broken game.
35. As a player, I want to be told my name and score stay on this device, so that I am not guessing what is being collected.
36. As a Bible reader, I want the game to say it is not affiliated with Watch Tower, so that it is clear whose project this is.

## Implementation Decisions

**Stack.** TypeScript, Vite, DOM and CSS. No engine and no canvas: per-character CSS font fallback is what makes Latin, Cyrillic and Georgian cheap in four Locales, and every canvas option rasterises text. Dev dependencies: `vite`, `typescript`, `vitest`; all MIT or Apache-2.0. Recorded as ADR-0001.

**The Mode boundary.** A Mode is a pure transition function plus a renderer. The shell owns screens, storage, Locale and names; a Mode owns rules, state and its own pixels. The contract, in shape:

```ts
type RunResult = {
  over: boolean;
  score: number;
  board: BoardId | null;   // null: this Run doesn't score (a "canon complete" Run)
  review: ReviewItem[];    // what the end screen lists, in the Mode's own words
};

interface Mode<S> {
  id: string;
  boards: readonly BoardId[];              // the shell never guesses which board
  createRun(options: RunOptions, locale: Locale): S;
  advance(state: S, dtMs: number, action: Action | null): S;   // pure, no clock, no randomness, no DOM
  render(state: S, host: HTMLElement): void;
  result(state: S): RunResult;
}
```

`advance` is pure: time arrives as `dtMs`, randomness arrives through a seeded PRNG carried in state. A Run therefore replays from its seed, and the whole ruleset is testable without a browser. Modes never touch `localStorage`; the shell never computes a score.

**Screens.** Five, all plain DOM: title, Route picker, Run, result, board. No router, no URLs, no history.

**The Rules** (all in one module so tuning is one file):
- Three lanes, one Gate per lane, one row per beat, exactly one correct Gate. Lanes are positional only — a Gate never moves.
- Three Lives. A wrong pick Bounces: the row does not advance, the same three Gates return, the correct one is marked, and the player must tap it to continue, which costs one Life and the Speed built so far and awards no points for that Gate.
- Speed climbs on each correct pick, decelerating toward a ceiling. The ramp and ceiling are **playtest numbers, not spec numbers**; they live in the Rules module with the lane geometry and Gate spacing, and nothing else reads them.
- Gate value is `100 × Speed`, rounded to an integer. Rounding is deliberate: it makes ties exact.
- Distractors are two other Books drawn from the correct answer's own Section, so a wrong Gate is always a plausible neighbour; no pair repeats within a Run. A Section with fewer than three Books falls back to the nearest adjacent Books.

**Routes.** A section route loops one Course and never ends except by Lives. A canon route starts at one of the ten Sections and continues through the canon; on reaching Revelation the player is offered finish-or-wrap once per pass. Five Courses: `Genesis–Song of Solomon` (Sections 1–3), `Isaiah–Malachi` (4–5), `Romans–Jude` (8–9), `Genesis–Malachi` (1–5), `Matthew–Revelation` (6–10). Gospels, Acts and Revelation are canon start points only — no Course contains them alone.

**Start boost.** Earned by completing a Route with no Bounces, stored as one boolean per Route, offered on the next Run of that Route, consumed by playing it.

**Content.** All 66 Books, in order, with one New World Translation name per Locale and four Locales complete on every row. Data is checked by a dependency-free script asserting 66 rows, contiguous Sections in canonical order, four non-empty names per row, and no two Books sharing a name within a Locale — the last one matters because a duplicate would put the correct answer on two Gates. Order and Section structure come from the universal Protestant canon; names are transcribed from the New World Translation's own per-Locale tables. No scripture text, footnotes or study material is used or shipped.

**Labels come from Book names.** Sections and Courses are labelled by their first and last Book, built from the content table at render time. No category name is invented, so there is no new vocabulary to translate and none to get wrong.

**Scores.** Six boards, one per Route. Top ten, ties to the earlier Run, a qualifying Run into a full board evicts the lowest. Score is `100 × Speed` summed over Gates, integer. Names are trimmed, 1–16 characters, any script, no control characters, empty becomes `Anonymous`. The Run's curve version is stored with the board; bumping it clears that board's entries, because scores from different curves are not comparable.

**Storage.** One key holding JSON: Locale, remembered name, and six boards each with its curve version and entries. All access inside `try`/`catch` — a browser that refuses to write must still play; persistence is a convenience, never a requirement. Nothing is transmitted anywhere.

**Locale.** Chosen on the picker, remembered, fixed for the duration of a Run — Book names are the game's vocabulary, so changing language mid-Run would rename Gates the player is about to meet. Default is `navigator.language` when that Locale is complete, otherwise English. A Locale is offered only when its string table is complete; there is no runtime fallback branch.

**Development language.** English only. Translation is a release gate that no development work waits on; the interface strings are a small chrome set, and Book names are already sourced in all four languages.

## Testing Decisions

A good test here asserts **external behaviour**: what a player sees happen, described in the glossary's words. No test touches a private function, a field name, or how a Gate is drawn. A test that would still pass after a total rewrite of the renderer is a good test.

**The seam: the pure Mode core.** Everything rules-shaped is tested by constructing a Run, applying a fixed sequence of `advance` calls with explicit `dt` and actions, and asserting the resulting public state and `result()`. This is the highest seam available and needs no new one: it is exactly the boundary ADR-0001 draws, so the tests add no structure the design didn't already have.

The cases that earn their place:
- A correct pick advances the row, raises Speed, and awards `100 × Speed` rounded.
- A wrong pick Bounces: the row stays, the same three Gates return, the correct Gate is marked, `result().over` is false, and Lives are one fewer.
- Tapping the marked Gate resumes after a Bounce, awards nothing for that row, and resets the Speed that was built.
- Three Bounces end the Run, and `result().review` lists the missed Books in canonical order.
- A Run with no Bounces reports the start boost as earned for its Route.
- A Section that loops back returns to its first Book rather than stopping.
- Reaching Revelation on a canon route offers finish-or-wrap exactly once per pass, and finishing reports `board: null` with a completion marker.
- Distractors are drawn from the answer's own Section, are never the answer, and no pair repeats within a Run — asserted over a seeded sequence.
- A Section with fewer than three Books produces three Gates anyway, via the fallback.
- `createRun` with the same seed produces the same Gate sequence, which is what makes every test above reproducible.

**Second seam: the content checker**, already in place and already proven capable of failing. It grows a second pass over the interface strings asserting every shipped Locale has every key, non-empty and trimmed.

**Not tested.** The renderer, the shell's screen transitions, and the CSS: they are judged by eye, and a test of them would encode today's layout as a promise. The scoreboard's storage layer gets one test at its boundary — that a refused write leaves the game playable rather than throwing.

## Out of Scope

- **Modes other than Book Order.** The boundary is in scope; a second Mode is a future effort. No plugin registry, no dynamic loading — an array a human edits.
- **Any New World Translation text, footnotes or study material.** Names and order only, and no data transcribed from jw.org.
- **App Store or Play Store shipping.** Mobile means the web build.
- **Accounts, online leaderboards, sync, multiplayer, ads, monetization.** No backend of any kind.
- **Native desktop packaging** (Electron, Tauri). The browser is the desktop.
- **Art and sound direction.** Placeholder geometry and system fonts' fallbacks until the loop proves itself.
- **Accessibility specifics** — keyboard-only play, colourblind-safe Gates, reduced-motion. Cheap, probably, but a decision for when Gate visuals exist.
- **Curriculum beyond Mode 1**: sections as a progression path, chapter counts as quiz material (`chapters` is carried in the data, unread).
- **Finished translations.** English ships; the friend's check of Dutch, Russian and Georgian is a later release gate.

## Further Notes

- **Tuning numbers are the open end of this spec, on purpose.** Speed ramp, ceiling, lane width and Gate spacing cannot be specified from a desk; they are the outcome of [the prototype ticket](issues/07-prototype-slice.md), which stays open after this spec. The Rules module is the single place they live, so setting them later is not a spec change.
- **The count to remember**: Gospels hold **four** Books (Matthew, Mark, Luke, John); Pauline Epistles hold 14 with Hebrews included; General Epistles 7. Acts and Revelation are single-Book Sections, which is why a section route on them would be a one-Gate lap and why they are canon start points only.
- **Georgian never gets `text-transform: uppercase`** — Mtavruli casing mangles mixed strings like `1 სამუელი`. Its font coverage is verified on a real screen when `ka` first turns on, not assumed.
- **Provenance** is recorded in `research/` and referenced by the content checker: names from the New World Translation's own tables, order and structure from the universal canon, and a "not affiliated with Watch Tower" note wherever the game names itself.
- **The bar** is not "finished" but "genuinely want to play", so the prototype outranks the last twenty percent of polish.
