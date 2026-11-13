# Architecture and mode boundary

Type: grilling
Status: resolved
Blocked by:

## Question

How the pieces sit in code, at a level a beginner can navigate: the shell (title → mode picker → run → result), what the `Mode` interface receives and returns, where the locale comes from and where it is persisted, where the scoreboard entries and the remembered name live, and the file layout.

Cover: how a mode reports its score, what the shell does when a locale is missing a string, and where the content table is imported from. Record the stack and the boundary together as one ADR in `docs/adr/` — both are expensive to reverse.

## Answer

Written as one ADR, because the stack and the boundary are the same decision: [`docs/adr/0001-stack-and-mode-boundary.md`](../../../docs/adr/0001-stack-and-mode-boundary.md).

In short:

- **A mode is a pure transition function plus a renderer.** `Mode<S>` is five methods: `createRun`, `advance(state, dtMs, action)`, `render(state, host)`, `result(state)`, plus the board ids it writes to. `advance` is pure — no clock, no randomness, no DOM — so a run replays from its seed and the core is testable without a browser.
- **The shell owns screens, storage, locale and names. The mode owns rules, state and its own pixels.** Modes never touch `localStorage`; the shell never computes a score.
- **Missing strings cannot happen at runtime.** A locale is offered only when its table is complete, so there is no fallback branch to get wrong.
- **Storage is one key**, `bible-runner:v1`, holding locale, remembered name, and every board with its curve version. All access inside `try/catch`: private-mode browsers can throw on write and the game must play anyway.
- **`vitest` joins the dev dependencies.** This machine's Node cannot strip TypeScript, so a `.ts` test has to pass through Vite's transform to run at all. That is the whole justification, and the pure core earns it.

File layout, the four-screen shell contract and the storage shape are in the ADR.
