# 17: Motion and steering — the Runner model in the Mode

Type: build
Status: resolved
Blocked by:

**What to build:** replace the shipped "three static buttons" model with the Runner model from ADR-0002, keeping the platform untouched. Rows of Gates travel toward the player; the player steers a Runner between three Lanes with ←/→ (and A/D), one Lane per keypress; the Gate in the Runner's Lane is judged when the Row arrives. The perspective projection currently proven in `spike/runner.html` becomes the Mode's renderer.

The pure core keeps its shape: `advance(state, dtMs, action)` still owns all rules, time still arrives as `dtMs`, randomness still comes from the seeded PRNG carried in state. What changes is the row model (a Row carries an arrival position rather than being a static choice) and the renderer (projection, not buttons).

- [x] Three Lanes, one Gate each, one Row per beat, exactly one Gate carrying the next Book
- [x] ←/→ and A/D move the Runner exactly one Lane per keypress, and pressing into an edge does nothing
- [x] A Row is judged in the Lane the Runner occupies when it arrives, not by any click
- [x] Rows approach on a perspective road: a Row at distance is higher on screen and smaller, and at least four Rows are legible ahead of the player
- [x] Gate text stays readable at every distance — sized for reading, not for perspective
- [x] The same seed and the same key sequence produce the same Run
- [x] Every existing rule that is not the row model still holds: no repeated Gate names within a Run's visible Rows, Distractors near the answer, Course laps, canon finish-or-wrap, Start boost, the six boards
- [x] Tests at the Mode seam cover steering, judgement by Lane, and determinism — no DOM, no storage
- [x] `npm run build`, `npm test` and `npm run check:content` green

**Not in scope:** the Stumble (ticket 18), jump/roll, coins, power-ups, pacing blocks, touch input.

## Answer

The Mode now runs the Runner model. `state.ts` holds Rows as `{ z, gates, answer }` travelling toward a Runner in one of three Lanes, judged in the Runner's Lane when `z` reaches 0; `rules.ts` holds the world units (`ROW_SPACING`, `ROWS_ON_ROAD`, `SPAWN_Z`, `ROW_TRAVEL_MS`); `render.ts` projects the spike's road and owns the page's one keydown listener (arrows and A/D, one Lane per press, ignored while the Run is over or asking). `Action` is `left | right | finish | wrap`; the shell was not touched. Lane and judgement tests, determinism, and the retained rules (Course laps, finish-or-wrap, Start boost, six boards) all pass. `LIVES` and the Bounce model are gone.
