# ADR-0002: the Runner model — Book Order is steered, not clicked

Status: accepted, 14 Nov 2026. Amends ADR-0001's Mode contract; supersedes the row model of ticket 11.

## Context

Book Order shipped its first playable version as a **choice**: three static rows of Gates, one holding the next Book, and the player clicked a button. Three wrong clicks spent three Lives and ended the Run.

Played once, it was a quiz with a moving background. Speed changed the score and nothing about the task, so mastery and patience felt identical — the game could not be lost more quickly by being bad at it, only by being wrong more often. Subway Surfers is the opposite: the world moves whether or not you touch anything, and your job is to keep steering.

The fix is not a mechanic bolted on. It changes what the player does: **read three names and steer into the right one before the row arrives**, rather than read three names and click afterwards.

## Decision

**1. Rows travel.** Each Row is three Gates that approach along the road and are judged when they reach the Runner. Space between Rows, approach time and the height of the horizon are renderer settings; the Rules hold the world-space cadence.

**2. The player steers a Runner in a Lane.** Three Lanes. The Runner occupies one; ←/→ (and A/D) move it one Lane per press. The Gate in the Runner's Lane is the answer that Row judges. There are no buttons to click during a Run.

**3. A wrong Lane is a Stumble, not a lost Life.** The Runner bounces back along the road, the world drops to about 0.5× for a beat, the Gate holding the next Book is marked green, and the Runner can steer into it and continue. Motion never stops.

**4. A repaired Row scores nothing.** The Book still counts as reached, so the canon advances and the Lanes ahead stay in order. Points are the only reward the game has; if repair paid, accuracy would stop mattering.

**5. A Stumble resets Speed to 1.0×.** Speed is both the arrival rate and the score rate, so this makes a mistake cost earning power without introducing a second currency.

**6. Lives are gone.** So is the Bounce that spent them and the "tap the marked Gate to continue" that followed it. The single failure state is **Caught**: a Row reaches the Runner while it is still in the wrong Lane.

**7. The end screen keeps the review.** Books stumbled on are listed in canon order, whether or not the Run ended. It is the only artefact a Run leaves that teaches.

**8. Keyboard only.** ←/→ and A/D, one Lane per keydown. Touch, swipe and gamepad are out of scope until mobile does.

## What this costs

- The Mode's row model and renderer are rewritten, and their tests re-earned. `advance` stays pure: time arrives as `dtMs`, randomness as a seeded PRNG, and a Stumble is a state transition like any other.
- `Life` and `Bounce` leave the glossary; `Runner`, `Lane`, `Stumble`, `Marked gate`, `Caught` and `Review` enter it.
- The spec's three-Lives mechanics, its Bounce, and its "tap the marked Gate" leave with them. The interface string `Lives {lives} · Speed {speed}` becomes speed alone.
- Everything above the Mode survives untouched: the shell, storage, six boards, Locales and string table, the five Courses and the canon Route, and the 66-Book content table.

## Alternatives considered

- **Three Lives with a Stumble that costs one.** Rejected: two failure counters (Lives and Speed) for one mistake, and a HUD that has to explain both. One rule is teachable at speed.
- **Pause the world on a wrong Lane, mark the answer, resume when acknowledged.** Rejected: a freeze turns the runner back into a quiz, and acknowledgement is the button we just removed.
- **A 3D renderer (three.js / WebGPU) to get the look.** Rejected for now; see `research/stack-oss.md`. The decisive fact is that the game's content is text in four scripts, which is the one thing the DOM does best and every 3D text path does worse. Revisit trigger is recorded there.
- **Pacing blocks (warm-up, rest) before tuning.** Deferred: blocks are only legible against a known baseline cadence, so the constant rhythm is tuned first.

## Consequences

- A Run now ends when the player stops correcting, not when a counter runs out. That is deliberate: the game is score-attack, and the pressure is the clock the Rows keep.
- Session testing must cover steering and judgement, not clicks. The Mode-seam tests carry it; the renderer is judged by eye.
- Uniform cadence across Locales is a known fairness risk: Georgian and Russian names take longer to read. It stays uniform until a native speaker plays, and the knob is a constant, not an architecture change.
