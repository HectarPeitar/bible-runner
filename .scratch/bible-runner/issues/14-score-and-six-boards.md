# 14: Score and the six boards

Type: build
Status: ready-for-agent
Blocked by: 12

**What to build:** a Run produces a score — `100 × Speed` at each correct Gate, rounded, summed — and the score finds its way onto the right board. Six boards, one per Route; a Run writes only to its own Route's board. The result screen shows the top three, and if the Run lands in the top ten it asks for a name, pre-filled with the last one used on this machine. Equal scores rank by who got there first; a qualifying score into a full board pushes out the lowest. The full board lives behind one button on the picker. A browser that refuses storage still plays.

- [ ] A correct pick adds `100 × Speed` rounded; the total is an integer
- [ ] The result screen shows the score and the top three entries of that Route's board
- [ ] A Run inside the top ten prompts for a name, pre-filled with the remembered one
- [ ] A Run outside the top ten shows its score and prompts for nothing
- [ ] The entered name is remembered and pre-filled next time
- [ ] Equal scores rank the earlier Run higher
- [ ] A qualifying score into a full board evicts the lowest entry
- [ ] Each Route has its own board; a Course lap never appears on the canon board
- [ ] Each board stores the speed-curve version, and bumping it clears that board's entries
- [ ] A refused storage write leaves the game playable and silent — no exception reaches the player
- [ ] Names are trimmed to 1–16 characters, accept any script, reject control characters, and empty becomes Anonymous
- [ ] Nothing is transmitted anywhere
