# 18: Stumble, correction and Caught

Type: build
Status: resolved
Blocked by: 17

**What to build:** the failure model from ADR-0002. Arriving at a Row in the wrong Lane is a **Stumble**: the Runner is pushed back along the road, the world slows to about half speed for a beat, and the Gate carrying the next Book is marked green so the Runner can steer into it. Reaching that Gate continues the Run; the Row scores nothing but the Book still counts, so the canon advances and Speed resets to its starting value. A Row arriving while the Runner is still in the wrong Lane ends the Run as **Caught**, and the Review lists the Books stumbled on in canon order.

- [x] A wrong Lane pushes the Runner back and slows the approach to about half speed for a beat
- [x] The Gate carrying the next Book is marked green for the duration of the correction
- [x] Steering into the marked Gate resumes the Run, scores nothing for that Row, and advances the canon
- [x] A Stumble resets Speed to its starting value
- [x] A Row arriving while still in the wrong Lane ends the Run as Caught
- [x] The Review lists every Book stumbled on, in canon order, whether or not the Run was Caught
- [x] `Life`, `Lives` and `Bounce` are gone from the interface strings and from the HUD; the string `Lives {lives} · Speed {speed}` becomes speed alone
- [x] `npm run check:content` stays green with `en` complete, and the strings file has no unused keys
- [x] Tests at the Mode seam cover: a Stumble marks the right Gate, a repaired Row scores nothing but advances, a missed correction ends the Run, Speed resets, and the Review orders Books canonically
- [x] `npm run build`, `npm test` and `npm run check:content` green

**Not in scope:** jump/roll, coins, power-ups, pacing blocks, touch input.

## Answer

A wrong Lane is a Stumble: the Row is pushed back `STUMBLE_PUSH_BACK` (a quarter of the Row spacing) and approaches at `STUMBLE_SLOWDOWN` (0.5×), the answer Gate is lit green with its distractors dimmed, Speed resets to `START_SPEED`, and the Book enters the Review. Steering into the marked Gate resumes with no score and no climb but advances the canon, so no Book is skipped. A Row arriving again in the wrong Lane is Caught and ends the Run. No single step may spend the correction: while stumbled, `advance` travels at most half the push-back, so a long frame cannot convert a Stumble into a Caught. `Life`, `Lives` and `Bounce` are gone from the strings and the HUD (`status` is `Speed {speed}`), and `startBoostEarned` no longer names Bounces.

Found in review and fixed here: two identical Book names could appear on the road at once, because the Distractor pool fell back to the whole road; answers are now reserved two rows ahead and the pool is capped to the nearest names. The Review also rendered only for a Run that was not canon-complete; it now renders for both.
