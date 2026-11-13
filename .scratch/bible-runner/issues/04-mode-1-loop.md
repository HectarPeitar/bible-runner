# Pin the Book Order run loop

Type: grilling
Status: open
Blocked by:

## Question

Pin the run loop precisely enough to build, in words rather than code:

- Gate geometry: how many gates are visible ahead, how many lanes, what the player controls each beat.
- The choice each beat: is there always exactly one correct next book available? What happens if two visible gates could both continue the sequence, or if the correct gate is off-screen?
- Lives: how many, and does a wrong gate lose a life and continue, or end the run?
- After a miss: what the player is shown — the correct book, its neighbours in the order, its alias, the note that they will see it again?
- **Speed and mastery**: a player who knows every book cold must not run out of game, so it gets faster and faster. Decide what drives that — an automatic ramp inside a run, a difficulty the player picks, or both — and what speed does to the score, because a fast run outscoring a slow clean one is the difference between a leaderboard that rewards mastery and one that decorates a finished section.
- **Run length once speed exists**: Gospels is five books, so a one-section run is over in seconds. Decide whether a run loops the section with speed climbing each lap, chains onward through the canon, or ends on the first miss — and what the last book of a section does to the ramp.
- Run boundaries: how a run starts, how it ends, and what the score counts.
- Distractor policy: near misses from the same section first, then same testament, never repeating a gate within a run, never showing the answer twice.

## Answer
