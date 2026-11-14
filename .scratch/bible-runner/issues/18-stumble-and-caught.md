# 18: Stumble, correction and Caught

Type: build
Status: ready-for-agent
Blocked by: 17

**What to build:** the failure model from ADR-0002. Arriving at a Row in the wrong Lane is a **Stumble**: the Runner is pushed back along the road, the world slows to about half speed for a beat, and the Gate carrying the next Book is marked green so the Runner can steer into it. Reaching that Gate continues the Run; the Row scores nothing but the Book still counts, so the canon advances and Speed resets to its starting value. A Row arriving while the Runner is still in the wrong Lane ends the Run as **Caught**, and the Review lists the Books stumbled on in canon order.

- [ ] A wrong Lane pushes the Runner back and slows the approach to about half speed for a beat
- [ ] The Gate carrying the next Book is marked green for the duration of the correction
- [ ] Steering into the marked Gate resumes the Run, scores nothing for that Row, and advances the canon
- [ ] A Stumble resets Speed to its starting value
- [ ] A Row arriving while still in the wrong Lane ends the Run as Caught
- [ ] The Review lists every Book stumbled on, in canon order, whether or not the Run was Caught
- [ ] `Life`, `Lives` and `Bounce` are gone from the interface strings and from the HUD; the string `Lives {lives} · Speed {speed}` becomes speed alone
- [ ] `npm run check:content` stays green with `en` complete, and the strings file has no unused keys
- [ ] Tests at the Mode seam cover: a Stumble marks the right Gate, a repaired Row scores nothing but advances, a missed correction ends the Run, Speed resets, and the Review orders Books canonically
- [ ] `npm run build`, `npm test` and `npm run check:content` green

**Not in scope:** jump/roll, coins, power-ups, pacing blocks, touch input.
