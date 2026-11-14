# Research: Book Order mode-1 stack (browser, static, zero backend, Latin + Cyrillic + Georgian)

Ticket: `.scratch/bible-runner/issues/01-research-stack.md`. All version/licence/date claims below are cited to a primary source fetched during this run. Latest release data observed in the sources: 11 Nov 2026 (PixiJS, Vite); 9 Jul 2026 (Phaser); 12 May 2026 (Kaplay tag). Where a statement is my judgement rather than something a source says, it is marked **inference**.

## Summary

Build mode 1 as **TypeScript + Vite + DOM/CSS, no engine and no canvas**. The single hardest requirement on the list is correct text in three scripts with font fallback, and that is the one thing the DOM gives free in one CSS line — CSS font selection runs *one character at a time*, so `font-family: "Noto Sans", "Noto Sans Georgian", sans-serif` renders Latin, Cyrillic and Mkhedruli from whichever face has the glyph ([MDN font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)). Gates are moving boxes of text; no physics, no sprites, three lives — a `<div>` with `transform: translateY()` per gate, one `requestAnimationFrame` loop, and a y-overlap check is the whole game. Runner-up is **Kaplay** (MIT, 66.7 kB gzip, beginner-first API): right size engine, wrong fit today because its text is rasterised and its releases have been alpha-only since mid-2025.

## Findings

### 1. Licence and release facts for the five candidates (direct evidence)

| Candidate | Licence | Latest release | Date |
|---|---|---|---|
| Vite (build tool) | MIT | 8.3.8 | 11 Nov 2026 |
| TypeScript | Apache-2.0 | 7.0.2 | 20 Aug 2026 |
| Phaser | MIT | 4.2.1 "Giedi" | 9 Jul 2026 |
| PixiJS | MIT | 8.23.0 | 11 Nov 2026 |
| Kaplay | MIT | 3001.0.19 (stable, npm `latest`) / 4000.0.0-alpha.27.1 (tag `next`) | 15 Jun 2025 / 12 May 2026 |

- **Vite 8.3.8, MIT.** Release `v8.3.8` published `2026-11-11T02:46:37Z` ([GitHub release API](https://api.github.com/repos/vitejs/vite/releases/latest)); licence text: "MIT License — Copyright (c) 2019-present, VoidZero Inc. and Vite contributors" ([LICENSE](https://raw.githubusercontent.com/vitejs/vite/main/LICENSE)). **Support:** direct evidence. **Confidence:** high.
- **TypeScript 7.0.2, Apache-2.0.** Release `v7.0.2` published `2026-08-20T18:09:49Z` ([GitHub release API](https://api.github.com/repos/microsoft/TypeScript/releases/latest)); "Apache License, Version 2.0, January 2004" ([LICENSE.txt](https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt)). **Support:** direct evidence. **Confidence:** high.
- **Phaser 4.2.1, MIT.** `tag_name: v4.2.1`, `created_at: 2026-07-09`, release body "Version 4.2.1 - Giedi - 9th July 2026" ([GitHub release API](https://api.github.com/repos/phaserjs/phaser/releases/latest)); repo licence field `spdx_id: MIT` ([repo API](https://api.github.com/repos/phaserjs/phaser)); Phaser's own statement: "Phaser is released under the MIT License… free to use it in commercial projects" ([phaser.io license](https://editor.phaser.io/download/license)). The Phaser 3 line was still patched after v4 shipped: v3.90.0 "Tsugumi", 23 May 2025 ([phaser.io news](https://www.phaser.io/news/2025/05/phaser-v390-released)). **Support:** direct evidence. **Confidence:** high.
- **PixiJS 8.23.0, MIT.** `tag_name: v8.23.0`, `created_at: 2026-11-…` ([GitHub release API](https://api.github.com/repos/pixijs/pixijs/releases/latest)); npm `latest` dist-tag = 8.23.0 ([registry dist-tags](https://registry.npmjs.org/-/package/pixi.js/dist-tags)); repo licence `spdx_id: MIT` ([repo API](https://api.github.com/repos/pixijs/pixijs)). **Support:** direct evidence. **Confidence:** high.
- **Kaplay (formerly Kaboom.js), MIT.** `LICENSE`: "MIT License — Copyright (c) 2025 KAPLAY Team" ([repo](https://github.com/kaplayjs/kaplay)); npm `latest` = `3001.0.19` with publish time `2025-06-15T16:52:19.114Z`, `next` = `4000.0.0-alpha.27.1` published `2026-05-12T21:51:08.832Z` ([registry doc](https://registry.npmjs.org/kaplay)); tags page confirms the last non-alpha tag is `3001.0.19` (15 Jun 2025) and the newest tag is `4000.0.0-alpha.27.1` (12 May 2026) ([tags](https://github.com/kaplayjs/kaplay/tags)). **Support:** direct evidence. **Confidence:** high.

Everything above is MIT / Apache-2.0. No candidate engine or tool in the required comparison is paid, closed, or source-available-only.

### 2. Disqualified candidates, named as required (direct evidence)

- **Defold — DISQUALIFIED: source-available, not open source.** Its licence is the "Defold License Version 1.0", which grants source redistribution but requires "You do not sell or otherwise commercialise the Work or Derivative Works as a Game Engine Product" ([defold.com/license](https://defold.com/license/)). Not an OSI-approved licence; excluded by the project's own rule.
- **Construct 3 — DISQUALIFIED: paid, closed.** Tiered paid plans ("Personal License", "Startup Plan", "Business Plan", "Educational Plan") with a feature-limited Free Edition ("Maximum Events … 50", "Maximum Layers … 2") ([construct.net buy page](https://www.construct.net/en/make-games/buy-construct-3)). No open-source licence for the runtime is offered.
- **GameMaker — DISQUALIFIED: paid, closed.** "GameMaker is absolutely free to download and keep forever for non-commercial use", but "If you want to make money from your game, you need to buy a Commercial License for $99.99"; console export needs an Enterprise subscription ([gamemaker.io/en/get](https://gamemaker.io/en/get)).
- **Unity — DISQUALIFIED: paid, closed.** Closed source with paid tiers: "Pro — $210.00 per month"; source code shown only as an Enterprise feature ("Source code access (read only)") ([unity.com/pricing](https://unity.com/pricing)).
- Out of scope and not evaluated: Godot (engine, not a browser-first stack at this scale), plus the paid editors/tools in the Phaser and PixiJS ecosystems, which are optional commercial products and do not change either engine's MIT licence.

### 3. Font fallback: the requirement that decides the stack (direct evidence)

1. **CSS does per-character fallback.** "Font selection does *not* stop at the first font in the list that is on the user's system. Rather, font selection is done *one character at a time*, so that if an available font does not have a glyph for a needed character, the latter fonts are tried." ([MDN font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)). This is exactly the Latin/Cyrillic/Georgian requirement, solved in a single declaration. **Support:** direct evidence. **Confidence:** high.
2. **Canvas accepts a CSS family list too, but does not manage loading for you.** `ctx.font` is "A string parsed as CSS `font` value", and MDN's guidance for webfonts in canvas is explicit: "With the help of the `FontFace` API, you can explicitly load fonts before using them in a canvas" ([MDN CanvasRenderingContext2D.font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font)); `document.fonts.ready` is the promise that resolves when pending font loads settle ([MDN FontFaceSet.ready](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready)). Fallback *lists* therefore work in canvas, but nothing lays out, wraps, or re-flows your text, and the first frame is wrong unless you gate it on a font promise. **Support:** direct evidence + inference. **Confidence:** high on the API facts; the "no layout" consequence is inference.
3. **Phaser explicitly does not load webfonts.** "You can only display fonts that are currently loaded and available to the browser: therefore fonts must be pre-loaded. Phaser does not do this for you, so you will require the use of a 3rd party font loader, or have the fonts ready available in the CSS on the page in which your Phaser game resides." The same doc shows a CSS family list working in the `fontFamily` option (`'Georgia, "Goudy Bookletter 1911", Times, serif'`) and warns that every text change re-rasterises the Text canvas and re-uploads the texture ([docs.phaser.io Text](https://docs.phaser.io/phaser/concepts/gameobjects/text)). Phaser's own example to use Google Fonts loads `webfont.js` from Google's CDN in `preload()` ([Phaser example](https://phaser.io/examples/v3.85.0/game-objects/text/view/google-webfont)). **Support:** direct evidence. **Confidence:** high.
4. **PixiJS v8 loads fonts through `Assets`, but text is still rasterised.** "PixiJS loads custom fonts via the `Assets` API. Supported formats: woff, woff2, ttf, otf… `await Assets.load({ src: 'my-font.woff2' })`", with per-face knobs (`family`, `display`, `unicodeRange`, `weights`, …), and the same re-rasterise-on-change warning ([PixiJS Text (Canvas) guide](https://pixijs.com/8.x/guides/components/scene-objects/text/canvas)). **Support:** direct evidence. **Confidence:** high.
5. **Kaplay loads fonts by name into a FontFace.** `loadFont(name: string, src: string | BinaryData)` — "Load a font (any format supported by the browser, e.g. ttf, otf, woff)" ([kaplayjs.com loadFont](https://kaplayjs.com/api/doc/ctx/loadFont/)). One family per loaded asset, and text is rasterised into the renderer; there is no CSS cascade to control. **Support:** direct evidence for the API; the "no CSS cascade" consequence is inference. **Confidence:** high / medium.
6. **Fonts that satisfy the licence rule:** Noto Sans Georgian is SIL OFL-1.1 ([Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Georgian); [notofonts/georgian](https://github.com/notofonts/georgian) — "This Font Software is licensed under the SIL Open Font License, Version 1.1"; [Fontsource package page](https://fontsource.org/fonts/noto-sans-georgian/about) lists `OFL-1.1`). OFL is in the acceptable set (free, permissive, self-hostable), and Google's CSS endpoint serves it as a plain `@font-face` TTF ([fonts.googleapis.com CSS](https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian&display=swap)). Noto's own docs: "All Noto fonts are licensed under the Open Font License. You can use them freely in your products and projects — print or digital, commercial or otherwise" ([Noto docs](https://notofonts.github.io/noto-docs/website/use/)). **Support:** direct evidence. **Confidence:** high.
7. **Georgian alone is not enough — you need at least two faces.** Google Fonts describes Noto Sans Georgian as a design "for texts in the European Georgian script" with 225 glyphs ([specimen](https://fonts.google.com/noto/specimen/Noto+Sans+Georgian)), so treat Latin/Cyrillic coverage as not guaranteed and pair it with a Latin+Cyrillic OFL face (e.g. Noto Sans) behind a generic fallback: `font-family: "Noto Sans", "Noto Sans Georgian", sans-serif`. **Support:** interpretation of the specimen's stated scope. **Confidence:** medium — worth a one-line glyph-coverage check at build time (see Missing evidence).
8. **Side effect of per-glyph fallback to watch:** mixed-script strings can mix faces with different x-height and baseline, so a single gate whose label changes language may shift visually. **Support:** inference (MDN describes the mechanism, not this consequence). **Confidence:** medium.

### 4. Bundle cost, measured (direct evidence)

| Package | minified | min+gzip | Source |
|---|---|---|---|
| phaser@4.2.1 | 1,375,080 B | **356,203 B** | [bundlephobia](https://bundlephobia.com/api/size?package=phaser@4.2.1) |
| pixi.js@8.23.0 | 995,155 B | **282,430 B** | [bundlephobia](https://bundlephobia.com/api/size?package=pixi.js@8.23.0) |
| kaplay@3001.0.19 | 183,583 B | **66,691 B** | [bundlephobia](https://bundlephobia.com/api/size?package=kaplay@3001.0.19) |
| no-engine (your code + Vite output) | — | ~0 kB of library | — |

These are whole-package figures, not tree-shaken slices; a Phaser or Pixi build that imports a subset ships less. Even so, the ordering (Phaser ≫ Pixi > Kaplay ≫ nothing) is stable. **Support:** direct evidence for the numbers; the tree-shaking caveat is interpretation. **Confidence:** high on numbers, medium on the caveat.

### 5. Beginner learning cost before the first gate moves

| Option | What must be learned first | Judgement |
|---|---|---|
| TS + Vite + DOM/CSS | HTML elements, one `requestAnimationFrame` loop, `transform`, a hit/overlap check, `pointerdown` | Smallest. The operator can inspect a gate in devtools and see exactly why it is where it is. **Inference.** |
| No-engine canvas 2D | the above **plus** `measureText` layout, DPR scaling, `document.fonts.ready` gating, manual hit-testing, manual redraw, no word wrap | More code than DOM for a worse text result at this game's scale. **Inference.** |
| Kaplay | `kaplay({...})`, `add([...])` component composition, `scene()`, the update loop | Genuinely small API; a playground with "more than 90 examples" is advertised ([README](https://github.com/kaplayjs/kaplay)). Best engine if an engine is wanted. **Inference.** |
| Phaser | `Phaser.Game` config, Scene lifecycle (`preload`/`create`/`update`), loader, game objects, camera/scale, plus a webfont workaround | Largest surface for a first game; official tutorial exists ([Making your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1)). **Inference.** |
| PixiJS | v8 async `app.init()`, `Assets`, stage/container graph, `Ticker` — then you write the game structure yourself | A renderer, not a game framework; more scaffolding than DOM. **Inference.** |

### 6. Touch, static hosting, and shell-plus-one-mode

- **Touch:** pointer events are "a hardware-agnostic representation of input devices… Examples of pointer input devices are mouse, pen/stylus, and touch contacts" ([MDN Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)). In DOM that means one `pointerdown` listener now and on mobile later; every engine listed also ships its own input layer, so none of the five blocks mobile. **Support:** direct evidence for the API; equal-cost conclusion across engines is inference. **Confidence:** high.
- **Static hosting, no backend:** `vite build` output "will be placed at `dist`. You may deploy this `dist` folder to any of your preferred platforms" ([Vite static deploy](https://vite.dev/guide/static-deploy)). All five options are the same shape here: static files, no server. **Support:** direct evidence. **Confidence:** high.
- **Shell + one mode:** DOM = two containers toggled by a boolean, no framework needed; Phaser has a Scene Manager; Kaplay has `scene()`; Pixi gives you neither. For "menu shell + one mode", the DOM and both full engines are all comfortable; only Pixi adds work. **Support:** interpretation. **Confidence:** medium.

### 7. Project health (direct evidence + judgement)

- Phaser: v4.2.1 on 9 Jul 2026 and a v3 patch on 23 May 2025 → actively maintained across two lines; ~40.7k stars, 187 open issues as returned by the GitHub API ([repo API](https://api.github.com/repos/phaserjs/phaser)). Healthy.
- PixiJS: 8.23.0 on 11 Nov 2026 with a dense 8.x tag stream (8.22.0, 8.23.0-dev, 7.4.3 legacy) ([dist-tags](https://registry.npmjs.org/-/package/pixi.js/dist-tags)); ~48.7k stars, 420 open issues. Very healthy, fastest-moving.
- Kaplay: stable `3001.0.19` has not been superseded since 15 Jun 2025; v4000 has been alpha for 18 months (alpha.15 in Dec 2024 → alpha.27.1 in May 2026) and the npm `latest` tag still points at 3001.x ([registry](https://registry.npmjs.org/kaplay), [tags](https://github.com/kaplayjs/kaplay/tags)); ~1.8k stars, 79 open issues. **Alive but pre-1.0 and mid-rewrite — the real reason Kaplay is runner-up rather than winner.** **Support:** direct evidence for dates; the risk reading is inference. **Confidence:** high on dates, medium on the risk judgement.

### 8. Recommendation, and why it beats the runner-up

**Build mode 1 in TypeScript + Vite + DOM/CSS. No engine, no canvas.**

Beats Kaplay (runner-up) on four points that matter for *this* game:

1. **Text is the game.** Gates carry text in four locales; DOM renders it with per-character fallback for free (Finding 3.1), and Kaplay must load one FontFace per family and rasterise, with no cascade to reason about (3.5).
2. **Nothing in the design needs an engine.** No physics, no sprites, three lives, y-overlap only (per the ticket's constraints). Engine features that justify an engine — collision, cameras, tweens, particles — are unused in mode 1.
3. **Release risk.** Kaplay's stable line has been frozen since Jun 2025 while v4000 stayed alpha (Finding 7); taking a pre-1.0 dependency on a first-ever shipped game is avoidable risk for zero benefit here.
4. **Debuggability for a first-timer.** A gate is a DOM node: devtools shows its box, its computed font stack, and which face actually rendered. This is the cheapest possible feedback loop and it is inference, but it follows directly from the DOM-vs-rasterised-text split above.

It also beats the other three: canvas-no-engine costs more code for worse text control (3.2); Phaser is 5× the bundle (Finding 4), the largest API surface, and still needs a third-party webfont loader (3.3); PixiJS is a renderer that leaves the entire game structure to you (3.4).

**Architecture that keeps the switch cheap:** keep the whole game as plain data + pure functions (`type Gate`, `advance(state, dt)`, `lives`, `score`, locale strings) with a thin DOM renderer behind a `render(state)` function. Every alternative here can drive that same core, so adopting an engine later means replacing the renderer, not rewriting the game.

### 9. The signal to switch later (mode 2)

Switch when any of these become true, in likely order:

1. **Mode 2 needs sprites, particles, or audio mixing.** That is the ticket's own trigger. Then add **Kaplay** (66.7 kB gzip, MIT, beginner-first API) if mode 2 is small, or **Phaser** if it wants scenes/cameras/tilemaps. Both consume the pure core unchanged.
2. **More than ~100 moving text nodes, or text that changes every frame.** DOM layout is the wrong tool for per-frame text mutation; Phaser's and Pixi's own docs warn the mirror image (re-rasterising text is expensive — [Phaser](https://docs.phaser.io/phaser/concepts/gameobjects/text), [PixiJS](https://pixijs.com/8.x/guides/components/scene-objects/text/canvas)), so this is the one case where the answer is *pre-rendered sprites/BitmapText*, not "more DOM".
3. **Kaplay ships 4000 stable.** That removes the only substantive objection to Kaplay and makes it the default choice for any future canvas-shaped mode.

## Contradictions

- **"Engine" vs "no engine" is genuinely contested in the beginner-game-dev community**, and the sources do not settle it: engine docs and tutorials all assume you want an engine, while nothing in the required comparison argues for the DOM. I resolved it by the specific constraints (no physics, text-heavy, static hosting, beginner) rather than by community consensus, and said so above. **Inference, flagged.**
- **Kaplay stability is read two ways.** Its repo is active (79 open issues, alpha releases through May 2026, frequent PRs) yet its *stable* npm line has not moved since Jun 2025. Both readings come from the same primary sources ([registry](https://registry.npmjs.org/kaplay), [tags](https://github.com/kaplayjs/kaplay/tags)); I took the conservative one.
- No source contradicted any licence or release-date fact I recorded.

## Missing evidence

- **Glyph coverage of Noto Sans Georgian for Latin/Cyrillic is not verified first-hand.** Google Fonts states 225 glyphs and Georgian-script scope; I did not run a cmap check. Until someone does, keep the two-face fallback stack rather than relying on one font.
- **No measured woff2 payload** for the two OFL faces, so the "no-engine ships ~0 kB" line in Finding 4 covers library code only; the font files are the real (and only) text cost, identical for all five options.
- **No hands-on timing test** of N moving DOM text nodes vs N canvas-drawn text nodes on a low-end phone. The "~100 nodes" threshold in Finding 9.2 is a judgement, not a measurement.
- **`source_check` returned `missing-evidence` (confidence 0.20) for the Kaplay stable-vs-alpha claim** — its retrieval returned no passages. I fell back to reading the primary sources directly (npm registry dist-tags + publish times, and the GitHub tags page), which state the claim plainly. Flagged as a validation limitation, not as a contradiction.
- **No check of Phaser v4-specific text/font docs.** The Phaser quotes come from the current Text concept page (docs.phaser.io), which covers Phaser 3 wording; v4's text API may have additions. Recommendation does not depend on it.
- **Kaplay touch API names not verified** in its docs; Finding 6 treats input as "every engine ships one" rather than naming functions.

## Sources

- Kept: [Phaser releases API](https://api.github.com/repos/phaserjs/phaser/releases/latest) — v4.2.1 tag, MIT, 2026-07-09; authoritative for version/date.
- Kept: [Phaser Text concepts](https://docs.phaser.io/phaser/concepts/gameobjects/text) — the decisive quote that Phaser does not preload webfonts, plus the CSS-list `fontFamily` example and re-rasterise warning.
- Kept: [phaser.io v3.90 news](https://www.phaser.io/news/2025/05/phaser-v390-released) — v3 line still maintained, 23 May 2025.
- Kept: [PixiJS releases API](https://api.github.com/repos/pixijs/pixijs/releases/latest) + [pixi.js dist-tags](https://registry.npmjs.org/-/package/pixi.js/dist-tags) — 8.23.0, MIT, 2026-11-11.
- Kept: [PixiJS Text (Canvas) guide](https://pixijs.com/8.x/guides/components/scene-objects/text/canvas) — `Assets.load` font pipeline, woff2 recommendation, re-rasterise cost.
- Kept: [Kaplay repo](https://github.com/kaplayjs/kaplay) (LICENSE = MIT 2025 KAPLAY Team; README/playground) and [loadFont API](https://kaplayjs.com/api/doc/ctx/loadFont/).
- Kept: [kaplay registry doc](https://registry.npmjs.org/kaplay) + [tags page](https://github.com/kaplayjs/kaplay/tags) — stable 3001.0.19 (2025-06-15) vs alpha-only tags through 2026-05-12.
- Kept: [Vite v8.3.8 release](https://api.github.com/repos/vitejs/vite/releases/latest) + [LICENSE](https://raw.githubusercontent.com/vitejs/vite/main/LICENSE) + [static deploy guide](https://vite.dev/guide/static-deploy) — MIT, 2026-11-11, `dist` → any static host.
- Kept: [TypeScript v7.0.2 release](https://api.github.com/repos/microsoft/TypeScript/releases/latest) + [LICENSE.txt](https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt) — Apache-2.0, 2026-08-20.
- Kept: [MDN font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) — per-character fallback, the core justification for the DOM recommendation.
- Kept: [MDN CanvasRenderingContext2D.font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) + [FontFaceSet.ready](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready) — canvas needs explicit font loading.
- Kept: [MDN Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) — mouse/pen/touch under one interface.
- Kept: [Noto Sans Georgian on Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Georgian), [notofonts/georgian](https://github.com/notofonts/georgian), [Fontsource OFL-1.1 metadata](https://fontsource.org/fonts/noto-sans-georgian/about), [Noto docs](https://notofonts.github.io/noto-docs/website/use/) — OFL licensing for the Georgian face.
- Kept: [bundlephobia](https://bundlephobia.com/api/size?package=phaser@4.2.1) (and the pixi.js / kaplay equivalents) — measured min+gzip sizes.
- Kept: [defold.com/license](https://defold.com/license/), [construct.net](https://www.construct.net/en/make-games/buy-construct-3), [gamemaker.io](https://gamemaker.io/en/get), [unity.com/pricing](https://unity.com/pricing) — the named disqualifications.
- Deprioritized: [Ourcade 2020 "Use Google Fonts in Phaser 3"](https://blog.ourcade.co/posts/2020/phaser-3-google-fonts-webfontloader/) — good practical walkthrough but 2020; the official Phaser doc states the same fact, so only used as corroboration.
- Deprioritized: [phaser3-webfont-loader](https://github.com/cloakedninjas/phaser3-webfont-loader) — community plugin showing the workaround, not needed as a source.
- Deprioritized: aggregator pages (npmx, gamedev.net news, FontArray) — secondary summaries of registry data I read directly.

## Next steps

1. One-minute glyph check before writing any CSS: dump the cmap of the chosen Noto faces for the four locales' strings, confirm Mkhedruli and Cyrillic both resolve, and record the two `@font-face` blocks that do it.
2. Time 50–150 moving DOM text nodes vs the same count drawn to canvas on the oldest phone available, to replace the "~100 nodes" judgement in Finding 9.2 with a number.
3. When mode 2 is specified, re-check Kaplay: if `4000.0.0` is stable by then, the switch is a renderer swap, not a rewrite.

## Addendum, 14 Nov 2026: three.js and WebGPU considered and declined

Asked after the first playable slice: should Book Order use three.js and/or WebGPU instead of DOM/CSS?

**Licence is not the obstacle.** `three` is MIT (npm registry: version 0.187.0, licence MIT) and WebGPU is a W3C standard, so both pass the "free, open, permissive" rule.

**What the sources say.** three.js now ships two renderers: `WebGLRenderer` and `WebGPURenderer`. `WebGPURenderer` tries WebGPU and **falls back to a WebGL 2 backend automatically** when the browser has no WebGPU, with a `forceWebGL` option to pin it (three.js docs, *WebGPURenderer*). WebGPU is supported in Chrome 113+, Chrome on Android 121+ (Android 12+, Qualcomm/ARM GPUs), Firefox 141 on Windows, and Safari 26; caniuse reports roughly 86.8% full support plus partial support, so about 89% coverage — good, not universal, and the fallback is still needed. Support: direct evidence. Confidence: high.

**Why it does not pay here.**

1. **The content is text, and text is what the DOM does best.** A 3D renderer has no text primitive; it needs `TextGeometry` from a baked font file, SDF atlases, or text rasterised into a canvas texture. All three lose the thing the stack was chosen for: one CSS `font-family` list resolving **per character**, so Latin, Cyrillic and Mkhedruli come from whichever face has the glyph. Rasterised text also loses selection, screen-reader access, and gets blurry at distance.
2. **There is no performance problem to solve.** The whole game is 24.9 kB of JS (8.16 kB gzip) and moves roughly a dozen DOM nodes. GPU rendering buys frames for a scene already inside budget. three.js would add an order of magnitude of code to paint the same three boxes. **Inference:** a minimal three scene compresses to roughly 130–160 kB gzip; I did not measure it, and the comparison is not close either way.
3. **WebGPU specifically adds capability, not features we need.** No compute work, no heavy shading, no particles planned. Its draw is throughput for scenes far larger than three lanes and a row of gates.
4. **Cost is a new mental model.** Scene graph, camera, materials, asset pipeline, plus a second fallback path — for a first game, that is the whole budget spent on plumbing rather than on the loop feeling right.

**The one honest counter-argument**, recorded so it is not lost: three.js has a `CSS3DRenderer` that positions real DOM elements in 3D with a camera. That would give true 3D placement with crisp, selectable text. It buys nothing today because the projection maths already in the spike (`scale = P/(P+z)`, `y = horizon + (player − horizon) · scale`) produces the same picture in ~20 lines, without a dependency. It becomes interesting only if gates need to rotate or tilt in 3D — a visual idea, not a learning one.

**Verdict:** stay on TypeScript + Vite + DOM/CSS. This does not weaken ADR-0001; it adds a reason.

**Revisit trigger, so this is a decision and not a habit:** switch renderer only if a specified visual goal cannot be met by transform-based projection — e.g. a moving 3D subway tunnel, trains with perspective volume, skeletal character animation, or hundreds of simultaneous sprites/particles. If that happens, three.js (WebGL renderer first, WebGPU only as an opt-in path) is the right tool, and it is a **renderer swap inside one Mode** — `advance` stays pure and the shell, storage, boards, locales, routes and content table are untouched. That reversibility is exactly what the Mode boundary was for.
