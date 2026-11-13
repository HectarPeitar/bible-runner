# 12: Routes — five Courses and every canon start

Type: build
Status: ready-for-agent
Blocked by: 11

**What to build:** the title screen gains a picker. Six choices, each labelled by Book range rather than by an invented name: the five Courses (`Genesis–Song of Solomon`, `Isaiah–Malachi`, `Romans–Jude`, `Genesis–Malachi`, `Matthew–Revelation`) and the canon Route, which can begin at any one of the ten Sections. A Course Run loops back to its first Book after its last, forever. A canon Run travels on through the canon, and on reaching Revelation offers the player a choice, once per pass: finish there, or wrap into Genesis and keep going. Finishing reports a canon-complete marker and no score.

- [ ] The picker offers exactly six Routes, every label built from the content table's Book names
- [ ] The canon Route offers all ten Sections as start points, and each starts the Run at that Section's first Book
- [ ] A Course Run reaching its last Book continues at its first Book rather than stopping
- [ ] Every Book in a Course's range is visited exactly once per lap, in order
- [ ] Reaching Revelation on a canon Run offers finish-or-wrap once per pass, and not again until the next pass
- [ ] Finishing at Revelation reports the Run as complete with no board and no score
- [ ] Wrapping continues the same Run without losing Lives or Speed
- [ ] Tests at the Mode seam: a lap wraps, the offer appears once, a finish reports no board
- [ ] A Section with fewer than three Books still produces three Gates
