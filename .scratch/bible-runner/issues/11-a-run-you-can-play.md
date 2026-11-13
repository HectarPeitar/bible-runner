# 11: A Run you can play, Gospels only

Type: build
Status: ready-for-agent
Blocked by:

**What to build:** open the page and play. A title, then straight into a Run on the Gospels Section: three lanes, three Gates printing Book names, exactly one of them the next Book in canon order. A correct pick advances the row and raises the Speed. A wrong pick Bounces — the row stays, the same three Gates return, the correct one is marked, and tapping it resumes at the cost of a Life and the Speed that was built. Three Lives end the Run, and the end screen lists the Books that were missed, in canonical order.

This is the tracer bullet: the first code in the repo, so it brings up the build, the loop and the Rules together. English only, one Route, no scoreboard, ugly on purpose. The Rules module holds every tuning number so ticket 16 can set them without touching anything else.

- [ ] `npm run dev` serves a page that plays; `npm run build` produces a static bundle
- [ ] Three lanes, one Gate each, one row per beat, and exactly one correct Gate
- [ ] The two Distractors are drawn from the correct answer's own Section and are never the answer
- [ ] A correct pick advances the row, raises Speed, and loses no Life
- [ ] A wrong pick leaves the row in place, returns the same three Gates, marks the correct Gate, and costs one Life
- [ ] Tapping the marked Gate continues the Run, awards no points for that row, and resets the Speed that was built
- [ ] Losing the third Life ends the Run, and the end screen lists the missed Books in canonical order
- [ ] The Rules are covered by tests at the Mode seam — a fixed seed and explicit time steps, no DOM, no storage — including "a wrong pick does not advance the row"
- [ ] The same seed produces the same Gate sequence
- [ ] Rendering writes only into the Mode's own host element; the Mode never touches storage
- [ ] `npm run check:content` still passes
- [ ] Deliberately absent: route choice, Locale choice, score, board, pause, sound
