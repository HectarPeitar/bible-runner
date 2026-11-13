# Local scoreboard: entries, names, and when it prompts

Type: grilling
Status: resolved
Blocked by:

## Question

All play is local — no server, no accounts.

**Settled by the operator:** a **top-N** board — a run that lands in the top N prompts for a name and joins the board; one that does not, does not. Gaps cost score (miss penalty), so a clean run and a sloppy one are not worth the same.

**Settled by the operator:** the board is for a **shared device** — the operator's own PC, played by them and by friends who come over — so names earn their place, and **each route gets its own board**.

Still to pin: the score formula's constants, N, ties, name limits, and where the board lives.

## Answer

### Whose scores these are

A **shared device**: one PC, played by the operator and by friends who drop in. That is what pays for name entry — the board is the thing that says whose 4,800 that was, and the remembered name is what saves a returning friend from retyping it. It also means the board must survive being *wrong* about a name — a friend types "Sam", a week later the field says "Sam" and someone else plays; typing over it is the normal case and must be easy, never a settings excursion.

### Six boards

**One board per route**: `law-history-wisdom`, `prophets`, `epistles`, `hebrew-scriptures`, `greek-scriptures`, and `canon`. Course boards hold laps; the canon board holds endless canon runs only, per [the run loop](04-mode-1-loop.md). No per-section boards — a section is where a canon run *starts*, not a thing you score. No per-locale boards: the rules don't change with language, so a score earned in Georgian and one earned in Dutch are comparable, and splitting a shared PC's list six ways by language would leave each list empty.

### Score

- **Gate value = 100 × speed at the moment of the correct pick**, rounded to an integer. Rounding is not cosmetic: it makes ties exact, and ties have to be decided.
- **Bounce: no point subtraction.** The miss already costs a life and the speed that was built. Charging points too is the same punishment twice, and it makes a bounced-but-clean run indistinguishable from a slow one.
- **Speed, not endurance, ranks the board** — a fast clean run must beat a long sloppy one, which is what multiplying by speed buys.

### Rules

| | |
|---|---|
| N | 10 entries per board |
| Ties | equal score → the earlier run ranks higher (first to reach it keeps the place) |
| Qualifying into a full board | the lowest entry drops off |
| Before the board is full | every run joins it |
| Non-qualifying run | no prompt, no entry; the result screen still shows the score |
| Name | trimmed, 1–16 characters, any script, no control characters; empty → "Anonymous" |
| Name memory | last name pre-filled, stored in `localStorage`, labelled as stored on this device only |
| Entry holds | `name`, `score`, `at` (timestamp). Nothing else — no locale, no account, no email |
| Where | top 3 on the result screen; the full board behind a Scores button on the mode picker |

### One thing that will bite: scores outlive the curve

Speed is a tuned curve with a ceiling, and [ticket 04](04-mode-1-loop.md) deliberately left the numbers to the prototype. So a board recorded against one curve is not comparable with one recorded against the next: a faster curve makes old records unbeatable, a slower one makes them free. **The board stores the curve version it was recorded under, and bumping that version clears the boards.** Documented as a deliberate wipe, not a bug — it only fires while the curve is being tuned.
