# 15: Start boost

Type: build
Status: ready-for-agent
Blocked by: 14

**What to build:** finishing a Route with no Bounces earns a Start boost for that Route. The next Run on that Route is offered it, once; accepting starts the Run already moving. It does not stack, it does not carry to another Route, and it is spent by playing it rather than by being offered.

- [ ] A Route completed with no Bounces records a boost for that Route
- [ ] A Route completed with one or more Bounces records nothing
- [ ] A Run that passed no Gate and finishes at Revelation at once records nothing
- [ ] The next Run on that Route offers the boost
- [ ] Accepting starts the Run at raised Speed; declining starts it normal
- [ ] The boost is consumed by the Run that accepts it, and is not re-offered
- [ ] Two clean Runs do not stack into a bigger boost
- [ ] A boost on one Route does not appear on another
- [ ] The offer survives a reload until it is spent
- [ ] Tests at the Mode seam: a clean Route sets it, a bounced Route does not, accepting spends it
