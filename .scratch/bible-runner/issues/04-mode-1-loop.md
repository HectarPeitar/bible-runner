# Pin the Book Order run loop

Type: grilling
Status: claimed
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
- **Start boost** exists for a player who can run a whole route clean.

Still to pin:

- **Does a bounce teach, or only cost?** With bounce-and-repeat the order is safe, but if the same three options return unmarked, a player who does not know the book burns three guesses and three lives at the first gate and learns nothing. Decide whether the correct gate becomes marked after a bounce, after two, or never — and whether the end-of-run screen reviews the books that bounced.
- **How the start boost is earned**: a toggle anyone may turn on, a reward for a clean run on that route, or charged during a pre-run action.
- **Whether the wrap-or-finish choice shares a scoreboard**: an endless run scores unboundedly more than one that stops at Revelation.
- **Score**: books passed, laps, speed — and what a bounce is worth in points, beyond the lives and speed it already costs.
- **Distractor policy**: near misses from the same section first, then same testament, never repeating a gate within a run, never showing the answer twice.

## Answer
