# 14: Score and the six boards

Type: build
Status: resolved
Blocked by: 12

**What to build:** a Run produces a score — `100 × Speed` at each correct Gate, rounded, summed — and the score finds its way onto the right board. Six boards, one per Route; a Run writes only to its own Route's board. The result screen shows the top three, and if the Run lands in the top ten it asks for a name, pre-filled with the last one used on this machine. Equal scores rank by who got there first; a qualifying score into a full board pushes out the lowest. The full board lives behind one button on the picker. A browser that refuses storage still plays.

- [x] A correct pick adds `100 × Speed` rounded; the total is an integer
- [x] The result screen shows the score and the top three entries of that Route's board
- [x] A Run inside the top ten prompts for a name, pre-filled with the remembered one
- [x] A Run outside the top ten shows its score and prompts for nothing
- [x] The entered name is remembered and pre-filled next time
- [x] Equal scores rank the earlier Run higher
- [x] A qualifying score into a full board evicts the lowest entry
- [x] Each Route has its own board; a Course lap never appears on the canon board
- [x] Each board stores the speed-curve version, and bumping it clears that board's entries
- [x] A refused storage write leaves the game playable and silent — no exception reaches the player
- [x] Names are trimmed to 1–16 characters, accept any script, reject control characters, and empty becomes Anonymous
- [x] Nothing is transmitted anywhere

## Answer

Built in `979957e, merged at 88912cf`.

`100 × Speed` rounded per correct Gate, six boards the Mode declares, top ten with ties to the earlier Run, eviction of the lowest, per-board curve version, and `cleanName` (trim, control characters dropped, 16 code points, `Anonymous`). Stored boards are re-validated on read; a refused write leaves the Run's entry in hand for the screen.

**Verification**: `npm run build`, `npx vitest run` (56 tests), and `npm run check:content` (content table and interface strings) all green on `integration/book-order`. A two-axis code review of the whole branch raised one missing spec requirement and several structural findings; all were fixed in `a14044f`.
