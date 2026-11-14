# 17: Motion and steering — the Runner model in the Mode

Type: build
Status: ready-for-agent
Blocked by:

**What to build:** replace the shipped "three static buttons" model with the Runner model from ADR-0002, keeping the platform untouched. Rows of Gates travel toward the player; the player steers a Runner between three Lanes with ←/→ (and A/D), one Lane per keypress; the Gate in the Runner's Lane is judged when the Row arrives. The perspective projection currently proven in `spike/runner.html` becomes the Mode's renderer.

The pure core keeps its shape: `advance(state, dtMs, action)` still owns all rules, time still arrives as `dtMs`, randomness still comes from the seeded PRNG carried in state. What changes is the row model (a Row carries an arrival position rather than being a static choice) and the renderer (projection, not buttons).

- [ ] Three Lanes, one Gate each, one Row per beat, exactly one Gate carrying the next Book
- [ ] ←/→ and A/D move the Runner exactly one Lane per keypress, and pressing into an edge does nothing
- [ ] A Row is judged in the Lane the Runner occupies when it arrives, not by any click
- [ ] Rows approach on a perspective road: a Row at distance is higher on screen and smaller, and at least four Rows are legible ahead of the player
- [ ] Gate text stays readable at every distance — sized for reading, not for perspective
- [ ] The same seed and the same key sequence produce the same Run
- [ ] Every existing rule that is not the row model still holds: no repeated Gate names within a Run's visible Rows, Distractors near the answer, Course laps, canon finish-or-wrap, Start boost, the six boards
- [ ] Tests at the Mode seam cover steering, judgement by Lane, and determinism — no DOM, no storage
- [ ] `npm run build`, `npm test` and `npm run check:content` green

**Not in scope:** the Stumble (ticket 18), jump/roll, coins, power-ups, pacing blocks, touch input.
