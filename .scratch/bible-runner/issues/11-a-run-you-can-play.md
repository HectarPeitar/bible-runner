# 11: A Run you can play, Gospels only

Type: build
Status: superseded
Blocked by:

**What to build:** open the page and play. A title, then straight into a Run on the Gospels Section: three lanes, three Gates printing Book names, exactly one of them the next Book in canon order. A correct pick advances the row and raises the Speed. A wrong pick Bounces — the row stays, the same three Gates return, the correct one is marked, and tapping it resumes at the cost of a Life and the Speed that was built. Three Lives end the Run, and the end screen lists the Books that were missed, in canonical order.

This is the tracer bullet: the first code in the repo, so it brings up the build, the loop and the Rules together. English only, one Route, no scoreboard, ugly on purpose. The Rules module holds every tuning number so ticket 16 can set them without touching anything else.

- [x] `npm run dev` serves a page that plays; `npm run build` produces a static bundle
- [x] Three lanes, one Gate each, one row per beat, and exactly one correct Gate
- [x] The two Distractors are drawn from the correct answer's own Section and are never the answer
- [x] A correct pick advances the row, raises Speed, and loses no Life
- [x] A wrong pick leaves the row in place, returns the same three Gates, marks the correct Gate, and costs one Life
- [x] Tapping the marked Gate continues the Run, awards no points for that row, and resets the Speed that was built
- [x] Losing the third Life ends the Run, and the end screen lists the missed Books in canonical order
- [x] The Rules are covered by tests at the Mode seam — a fixed seed and explicit time steps, no DOM, no storage — including "a wrong pick does not advance the row"
- [x] The same seed produces the same Gate sequence
- [x] Rendering writes only into the Mode's own host element; the Mode never touches storage
- [x] `npm run check:content` still passes
- [x] Deliberately absent: route choice, Locale choice, score, board, pause, sound

## Answer

Built in `72c37b8, merged at 83c0d87`.

A playable Run on the Gospels Section: `src/modes/book-order/` with a pure `state.ts`/`rules.ts`, a DOM `render.ts`, `src/shell/` owning the flow and the loop, and a seeded PRNG so a Run replays. 13 tests at the Mode seam. Wrong pick keeps the row, marks the correct Gate, costs a Life and the Speed; three Lives end the Run with the missed Books in canon order.

**Verification**: `npm run build`, `npx vitest run` (56 tests), and `npm run check:content` (content table and interface strings) all green on `integration/book-order`. A two-axis code review of the whole branch raised one missing spec requirement and several structural findings; all were fixed in `a14044f`.

## Superseded

The row model this ticket built — three static Gates judged by a click — was replaced by ADR-0002 (the Runner model): Rows travel, the player steers a Runner between Lanes, and judgement happens on arrival. Tickets [17](17-motion-and-steering.md) and [18](18-stumble-and-caught.md) carry that work. What survives from this ticket: the Mode boundary, the pure `advance`, the seeded PRNG, the loop, the shell, and 13 tests' worth of rule coverage that the rewrite must keep passing or re-earn.
