# 15: Start boost

Type: build
Status: resolved
Blocked by: 14

**What to build:** finishing a Route with no Bounces earns a Start boost for that Route. The next Run on that Route is offered it, once; accepting starts the Run already moving. It does not stack, it does not carry to another Route, and it is spent by playing it rather than by being offered.

- [x] A Route completed with no Bounces records a boost for that Route
- [x] A Route completed with one or more Bounces records nothing
- [x] A Run that passed no Gate and finishes at Revelation at once records nothing
- [x] The next Run on that Route offers the boost
- [x] Accepting starts the Run at raised Speed; declining starts it normal
- [x] The boost is consumed by the Run that accepts it, and is not re-offered
- [x] Two clean Runs do not stack into a bigger boost
- [x] A boost on one Route does not appear on another
- [x] The offer survives a reload until it is spent
- [x] Tests at the Mode seam: a clean Route sets it, a bounced Route does not, accepting spends it

## Answer

Built in `448f9d3, merged at 6a06dd9`.

A Route completed with no Bounces records one boost, stored as an opaque per-Route flag, offered beside the normal start (so it can be declined) and spent by the Run that accepts it. Twelve tests, including that a second clean Route is still one boost and that a stored value which is not `true` is no boost.

**Verification**: `npm run build`, `npx vitest run` (56 tests), and `npm run check:content` (content table and interface strings) all green on `integration/book-order`. A two-axis code review of the whole branch raised one missing spec requirement and several structural findings; all were fixed in `a14044f`.
