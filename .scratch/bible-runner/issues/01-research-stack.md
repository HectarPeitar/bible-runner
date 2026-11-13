# Stack: what mode 1 is built in

Type: research
Status: resolved
Blocked by:

## Question

Which free/open-source stack should Book Order be built in, given: a beginner's 2D browser game (gates carrying moving text, three lives, no physics engine needed), touch-capable for later mobile, human-readable source, four locales needing correct font fallback across Latin + Cyrillic + Georgian Mkhedruli, static hosting, zero backend?

Compare at minimum: no-engine (TypeScript + Vite + DOM/CSS), no-engine with a canvas renderer, Phaser, Kaplay, PixiJS. For each: license (must be permissive — MIT / Apache-2.0 / BSD / zlib; **exclude anything paid, closed, or source-available-only**), what a beginner must learn before the first gate moves, how text and font fallback work (canvas needs manual webfont loading; DOM gets `@font-face` fallback for free), touch input cost, bundle size, last release and project health, and how comfortably each hosts a shell plus a single mode.

Deliver a recommendation, the reasons it beats the runner-up, and the signal that would make us switch later (mode 2 wants sprites, particles, or audio mixing).

## Answer

**TypeScript + Vite + DOM/CSS. No engine, no canvas.** Findings: [`research/stack-oss.md`](../../../research/stack-oss.md).

The requirement that decided it is text, not games: CSS selects fonts *per character*, so `"Noto Sans", "Noto Sans Georgian", sans-serif` renders Latin, Cyrillic and Mkhedruli correctly in one declaration — which is exactly what four locales need. Every canvas-based option rasterises text instead, and both Phaser and PixiJS ship docs warning about re-rasterising on change; Phaser additionally does not preload webfonts at all.

Runner-up **Kaplay** (MIT, 66.7 kB gzip, beginner-friendly) was rejected on two counts: text is rasterised with one FontFace per family and no cascade, and its stable npm line has been frozen at `3001.0.19` since Jun 2025 while v4000 has been alpha for 18 months. Taking a pre-1.0, mid-rewrite dependency on a first-ever shipped game buys nothing here.

Also rejected: canvas-by-hand (more code, worse text), Phaser (356 kB gzip, largest API surface, still needs a webfont loader), PixiJS (a renderer, leaves all game structure to you). Named disqualified as not genuinely open source: Defold (source-available, no-commercial-engine clause), Construct 3, GameMaker, Unity (paid/closed). All dependencies in the chosen path are MIT or Apache-2.0; the Noto faces are SIL OFL-1.1.

**Constraint on how it is built**: keep the game as plain data plus pure functions (`type Gate`, `advance(state, dt)`, lives, score, locale strings) with a thin DOM renderer behind `render(state)`. Every alternative drives that same core, so switching engines later replaces the renderer, not the game.

**Switch signal**: adopt Kaplay (small mode 2) or Phaser (scenes/cameras/tilemaps) when mode 2 needs sprites, particles or audio mixing — or when more than ~100 text nodes move at once, at which point the answer is pre-rendered text, not more DOM.

**Open item from the research**: glyph coverage must be checked once — Noto Sans Georgian is scoped to Georgian, so it is paired with Noto Sans rather than trusted alone, and font payload (identical for all options) is the real cost the "#​0 kB library" figure hides.
