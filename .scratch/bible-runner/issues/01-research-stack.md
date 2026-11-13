# Stack: what mode 1 is built in

Type: research
Status: claimed
Blocked by:

## Question

Which free/open-source stack should Book Order be built in, given: a beginner's 2D browser game (gates carrying moving text, three lives, no physics engine needed), touch-capable for later mobile, human-readable source, four locales needing correct font fallback across Latin + Cyrillic + Georgian Mkhedruli, static hosting, zero backend?

Compare at minimum: no-engine (TypeScript + Vite + DOM/CSS), no-engine with a canvas renderer, Phaser, Kaplay, PixiJS. For each: license (must be permissive — MIT / Apache-2.0 / BSD / zlib; **exclude anything paid, closed, or source-available-only**), what a beginner must learn before the first gate moves, how text and font fallback work (canvas needs manual webfont loading; DOM gets `@font-face` fallback for free), touch input cost, bundle size, last release and project health, and how comfortably each hosts a shell plus a single mode.

Deliver a recommendation, the reasons it beats the runner-up, and the signal that would make us switch later (mode 2 wants sprites, particles, or audio mixing).

## Answer
