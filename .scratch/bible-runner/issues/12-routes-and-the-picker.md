# 12: Routes — five Courses and every canon start

Type: build
Status: resolved
Blocked by: 11

**What to build:** the title screen gains a picker. Six choices, each labelled by Book range rather than by an invented name: the five Courses (`Genesis–Song of Solomon`, `Isaiah–Malachi`, `Romans–Jude`, `Genesis–Malachi`, `Matthew–Revelation`) and the canon Route, which can begin at any one of the ten Sections. A Course Run loops back to its first Book after its last, forever. A canon Run travels on through the canon, and on reaching Revelation offers the player a choice, once per pass: finish there, or wrap into Genesis and keep going. Finishing reports a canon-complete marker and no score.

- [x] The picker offers exactly six Routes, every label built from the content table's Book names
- [x] The canon Route offers all ten Sections as start points, and each starts the Run at that Section's first Book
- [x] A Course Run reaching its last Book continues at its first Book rather than stopping
- [x] Every Book in a Course's range is visited exactly once per lap, in order
- [x] Reaching Revelation on a canon Run offers finish-or-wrap once per pass, and not again until the next pass
- [x] Finishing at Revelation reports the Run as complete with no board and no score
- [x] Wrapping continues the same Run without losing Lives or Speed
- [x] Tests at the Mode seam: a lap wraps, the offer appears once, a finish reports no board
- [x] A Section with fewer than three Books still produces three Gates

## Answer

Built in `fb60bf5, merged at 7454954`.

Six Routes labelled by Book range from the content table, five Courses that lap forever, all ten Sections as canon start points, and finish-or-wrap offered once per pass with a finish reporting `board: null`. Nine Route tests added; the 13 existing tests adapted rather than dropped.

**Verification**: `npm run build`, `npx vitest run` (56 tests), and `npm run check:content` (content table and interface strings) all green on `integration/book-order`. A two-axis code review of the whole branch raised one missing spec requirement and several structural findings; all were fixed in `a14044f`.
