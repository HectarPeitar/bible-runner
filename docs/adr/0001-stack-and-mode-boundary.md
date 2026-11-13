# ADR 0001 — Stack and mode boundary

- **Status**: accepted
- **Date**: 2026-02-14
- **Decides**: [stack research](../../research/stack-oss.md), [run loop](../../.scratch/bible-runner/issues/04-mode-1-loop.md), [i18n policy](../../.scratch/bible-runner/issues/06-i18n-policy.md), [scoreboard](../../.scratch/bible-runner/issues/09-scoreboard.md)

Both halves are expensive to reverse: a stack swap rewrites everything, and a mode boundary that leaks turns the second mode into surgery. Recording them together because they are the same decision — *what is a mode, and what is it made of.*

## Context

Browser-first static game, no backend, no accounts. Beginners maintain it: boring and small beats clever. Four locales including Georgian, whose text is the reason a canvas engine was rejected — CSS font fallback per character solves three scripts without writing a rasteriser. One mode ships (Book Order); the boundary exists so a second mode doesn't require reconstructive surgery, not so modes can be swapped at runtime.

## Decision

### Stack

**TypeScript + Vite + DOM/CSS. No engine, no canvas.** Dev dependencies: `vite`, `typescript`, `vitest` (all MIT or Apache-2.0). Nothing else unless it earns its place.

Vitest is in the list because a `.ts` test file has to pass through Vite's transform to run here: Ubuntu ships Node `+dfsg`, a repack that drops the prebuilt SWC WebAssembly binary behind Node's built-in type stripping, so `node file.ts` and `node:module.stripTypeScriptTypes()` fail with `ERR_NO_TYPESCRIPT`. That is Node's *direct execution* feature missing, not TypeScript — Vite compiles `.ts` normally. Vitest is the smallest way to run the pure core's tests without adding a runner or a build step.

### The mode boundary

A mode is a pure transition function plus a renderer. **The shell owns screens, storage, locale and names. A mode owns rules, state and its own pixels.**

```ts
// src/modes/types.ts — the whole contract
export type RunResult = {
  over: boolean;
  score: number;
  board: BoardId | null;   // null: this run doesn't score (e.g. a "canon complete" run)
  review: ReviewItem[];    // what the end screen lists, in the mode's own words
};

export interface Mode<S> {
  id: string;
  /** Boards this mode writes to. The shell never guesses. */
  boards: readonly BoardId[];
  createRun(options: RunOptions, locale: Locale): S;
  /** Pure: returns the next state, never mutates. */
  advance(state: S, dtMs: number, action: Action | null): S;
  /** Writes into its own host element only. */
  render(state: S, host: HTMLElement): void;
  result(state: S): RunResult;
}
```

Rules that keep the boundary real:

- `advance` is **pure** — same state and input, same result. No `Date.now()`, no `Math.random()`, no DOM. Randomness and time arrive as state and `dtMs`, so a run is reproducible from its seed and a bug is replayable.
- Modes never touch `localStorage`. They report a score and a board id; the shell decides whether it qualifies and asks for a name.
- Modes never know a name, a screen, or a font. The shell never knows a book, a gate, a lane or a life.
- The shell never computes a score. It reports what the mode returned.

### Files

```
index.html
src/
  main.ts                 boot: load storage, mount shell
  shell/
    shell.ts              title → mode picker → run → result
    screens.ts            the four screens, plain DOM
  modes/
    types.ts              Mode<S>, RunResult, Action, RunOptions
    book-order/
      index.ts            the Mode: boards, createRun/advance/render/result
      state.ts            RunState and the transitions (pure)
      rules.ts            lives, lanes, bounce, speed curve, gate value
      render.ts           DOM/CSS for lanes, gates, lives, speed
  content/
    books.json            the 66 books, four NWT names each
    books.ts              types over books.json
    strings.json          the interface chrome, one table per Locale
    strings.ts            types over it, and which Locales are offered and remembered
  platform/
    storage.ts            one localStorage key, read and written through try/catch
    board.ts              top-N insert, tie rule, curve-version wipe
    loop.ts               requestAnimationFrame → advance → render
    random.ts             seeded PRNG (mulberry32, ~5 lines, no dependency)
    types.ts              BoardId, Locale re-export, storage shapes
```

`static/` holds the two Noto families and the icon. `scripts/check-content.mjs` validates `books.json` and, once `strings.ts` exists, string completeness.

### Shell contract

1. **Boot** — read storage; resolve locale: stored → `navigator.language` → `en`, keeping only locales whose string table is complete.
2. **Picker** — mode, route and start point. Route labels are book ranges (`Genesis–Song of Solomon`), built from `books.json`, never from a string constant.
3. **Run** — `createRun()` once, then `loop.ts` calls `advance(state, dt, action)` and `render(state, host)`.
4. **Result** — `result(state)`; if `over` and `board` is set, ask `board.ts` whether it qualifies, then prompt for a name (pre-filled with the remembered one), then write and show the top 3.
5. **Missing string** — cannot happen at runtime. A locale is offered only when its table is complete; completeness is a check, not a promise. There is no fallback branch to get wrong.

### Storage

One key, `bible-runner:v1`, one JSON object:

```ts
{
  locale: Locale;
  name: string;                       // remembered, for a shared PC
  boards: Record<BoardId, { curve: number; entries: { name: string; score: number; at: number }[] }>;
}
```

One key means one read, one write, one thing to clear. All access goes through `storage.ts` inside `try/catch`: private-mode browsers can throw on write, and the game must play anyway — persistence is a convenience, never a requirement.

`curve` is the speed-curve version. Bumping it in `rules.ts` wipes that board's entries, because scores recorded under a different curve are not comparable. Documented, deliberate, and only fires while the curve is being tuned.

### Consequences

- **An engine later is a renderer swap.** `render(state, host)` is the seam; `advance` doesn't know how it is drawn.
- **The pure core is testable without a browser** — which is what makes vitest worth its dependency.
- **DOM updates must stay cheap.** Three lanes and one row per beat is a handful of nodes; `render` sets `textContent` and `className` on nodes it created once. No virtual DOM, no diffing library.
- **60 fps is a ceiling, not a goal.** `loop.ts` clamps `dt` (a tab switch must not teleport gates behind the player's back).
- **Scores are only comparable within a board and a curve version.** That is a property of the design, not a defect.
- **A second mode is additive**: a new folder under `modes/`, one entry in the registry array. No plugin system, no dynamic import, no config — an array literal that a human edits.
