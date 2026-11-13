# Pin the Book Order run loop

Type: grilling
Status: resolved
Blocked by:

## Question

Pin the loop precisely enough to build, in words rather than code.

**Settled by the operator** — Book Order has two **routes**, both reachable from the same mode, the same shell and the same kind of scoreboard:

- **Section route** — loops a single section (Gospels, Pauline Epistles), speed climbing each lap, so a player who knows the books cold still has somewhere to go.
- **Canon route** — runs the whole canon, and can **start at any point**: start at the Gospels, start at the Law, run whatever stretch the player is drilling.

**Settled in round one:**

- **Canon route ending is a per-run choice** — the player decides before a canon run whether it finishes at Revelation or wraps into Genesis and keeps going.
- **Start points are the ten sections**, not individual books. Both routes therefore start at a section boundary.
- **Gate geometry**: three lanes, one gate per lane, one row per beat, exactly one correct book on screen. Everything scrolls toward the player.
- **Three lives.** A wrong gate costs a life *and* the speed gained so far. The run ends at zero lives — no timer, no lap limit, no "you finished" ending.
- **Bounce, don't skip.** A wrong pick does not advance the run: the same three options return and the correct one must still be picked. The canon is never passed over, so a run cannot teach a wrong order.
- **Speed curve**: climbing, decelerating toward a ceiling — fast at first, harder to gain near the top. The ceiling is set during prototyping, not now.
- **Start boost**, earned: run a route clean and the next run on that route offers one. Not a menu toggle.
- **A bounce teaches**: after one bounce the correct gate is marked and you tap it to continue — a life and the speed earned are the price, the name is the lesson. The end-of-run screen lists every book that bounced, in order.
- **Two scoreboard shapes**: the canon route's endless runs share the canon board; a run that stops at Revelation earns a "canon complete" marker instead of a score.
- **Distractors come from the answer's own section** — two other books from the same section, so the choice tests where a book sits among its neighbours in kind. Fallback needed where a section holds fewer than three books (see answer).

Still to pin:

- **Does a bounce teach, or only cost?** With bounce-and-repeat the order is safe, but if the same three options return unmarked, a player who does not know the book burns three guesses and three lives at the first gate and learns nothing. Decide whether the correct gate becomes marked after a bounce, after two, or never — and whether the end-of-run screen reviews the books that bounced.
- **How the start boost is earned**: a toggle anyone may turn on, a reward for a clean run on that route, or charged during a pre-run action.
- **Whether the wrap-or-finish choice shares a scoreboard**: an endless run scores unboundedly more than one that stops at Revelation.
- **Score**: books passed, laps, speed — and what a bounce is worth in points, beyond the lives and speed it already costs.
- **Distractor policy**: near misses from the same section first, then same testament, never repeating a gate within a run, never showing the answer twice.

## Answer

The loop, as settled:

**Routes.** A section route loops a **course** — a named grouping of sections — not a single section; a canon route runs the canon from any one of the ten section starts. Before a canon run the player chooses whether it *finishes* at Revelation or *wraps* into Genesis and continues. Section route = endless laps. Canon route = endless, or finite by choice.

**A beat.** Three lanes, one gate per lane, one row arriving at a time, scrolling toward the player, exactly one correct book on screen. Everything moves: a single `translateY` per gate, one overlap test.

**Correct pick.** The run advances; speed climbs a little, decelerating toward a ceiling (curve and ceiling are prototyping numbers, not spec numbers). Score for the gate is its base value multiplied by the current speed, so speed — not endurance — is what a board ranks.

**Wrong pick — a bounce.** The row does not advance and no book is skipped, so the canon can never be passed over and the run cannot teach a wrong order. Costs one life and the speed earned so far. After one bounce the correct gate is marked and the player taps it to continue: the price is a life and the speed, the lesson is the name. Three lives, run ends at zero. No timer, no lap limit, no "you finished" ending. The end-of-run screen lists every book that bounced, in order.

**Start boost.** Earned, not offered: run a route clean and the next run on that route starts boosted. One boolean per route in local storage.

**Distractors.** Two other books from the answer's own section, never the same pair twice in a row, never the answer twice.

**Known hole in the distractor rule.** Acts and Revelation are sections of exactly one book, so "two from the same section" is unsatisfiable there; the Gospels hold only four books, so the same pair recurs quickly. Fallback: where a section holds fewer than three books, take the nearest books by canon position from the adjoining section (Acts pulls from John/ Romans; Revelation from Jude/ Genesis) — position-based, so the choice is still about where a book sits, not about which section it belongs to.

**Open, deliberately:** the numeric shape of the speed curve, its ceiling, and whether a bounce returns speed to the run's start (including any boost) or to zero-gain base — all prototyping findings.

## Amendments

- Section routes loop **courses**, not sections (see `GLOSSARY.md`). Five courses: `Law, History & Wisdom` (sections 1–3, 22 books), `Major and Minor Prophets` (4–5, 17), `Epistles` (8–9, 21), `Hebrew Scriptures` (1–5, 39), `Greek Scriptures` (6–10, 27). They overlap on purpose; each is an independent loop.
- Gospels, Acts and Revelation get **no course of their own** — they are canon start points only. A one-gate lap is not a run, and Gospels is reachable through `Greek Scriptures`.
- Assumed, not contradicted: a lap climbs speed continuously across the whole course, not per section.
