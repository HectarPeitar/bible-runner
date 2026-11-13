# Build the thin playable slice

Type: prototype
Status: resolved
Blocked by:

## Question

Build the slice: one section (Gospels is the easiest to verify), gate choice, three lives, **English only** ([the i18n policy](06-i18n-policy.md) makes translation a release gate, so the slice never touches it), ugly on purpose. The scoreboard is deliberately absent here — a name prompt does not help answer whether the loop is fun.

Its job is to answer "is this fun for sixty seconds?" — not to look good, not to cover all ten sections, not to handle bookmarks. Throw it away if the loop is wrong; keep it if it is right.

Record what felt wrong: speed, gate spacing, distractors that read as unfair, whether lives or a timer punishes better, and whether the player learns anything from a miss or only feels bad.

## Answer

**Absorbed by the build tickets, not duplicated.** This ticket asked for two things: a runnable slice, and a verdict on whether the loop is fun.

- The slice is [ticket 11](11-a-run-you-can-play.md) — a Run on the Gospels Section with three lanes, three Lives and the Bounce. Building the throwaway here and then building it again as the real thing would have been the same code twice.
- The verdict is [ticket 16](16-set-the-numbers-by-playing.md) — playing until the tuning numbers are set, and recording what felt wrong.

The one instruction from this ticket that survives verbatim, and is copied into both: record what felt wrong — speed, Gate spacing, Distractors that read as unfair, whether Lives or a timer punishes better, and whether the player learns anything from a miss or only feels bad.
