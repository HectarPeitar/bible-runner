# Map: Bible Runner

## Destination

A spec in this repo a build session can execute without making a new decision: the mode boundary, the four-locale content model, and a locked free-OSS stack — scoped to one mode (Book Order) that a beginner can bring to "I genuinely want to play this" in a couple of weeks of evenings, proven by a thin playable slice.

## Notes

- **Domain**: Bible book order, taught from the New World Translation's canon and naming (Jehovah's Witnesses). NWT is a 66-book canon in Protestant order. Book *names and order only* — never NWT text, footnotes, or study material. Vocabulary in `GLOSSARY.md`.
- **Locales**: en, nl, ru, ka today, more later — so book names are locale data in one table, never constants in code. The interface language follows the book-name language; chosen by a picker in the shell, defaulting to `navigator.language`. Fonts must cover Latin, Cyrillic, and Georgian (Mkhedruli).
- **Standing preferences**: browser-first static game — no backend, no accounts, no paid services. Mobile means web, not app stores. **Every dependency must be free and open-source with a permissive license**; no paid or closed packages, no proprietary SDKs or assets. Our own code MIT, public repo, GitHub Pages. Beginner game developer: boring and small beats clever.
- **Architecture leanings**: shared shell (title → mode picker → run → result) plus a `Mode` interface; exactly one mode registered, no plugin registry. Stack locked: TypeScript + Vite + DOM/CSS, no engine — pure game core behind a `render(state)` function, so an engine later is a renderer swap.
- **Two routes**: Book Order travels either a **section route** (loops one section, speed climbing) or a **canon route** (whole canon, startable at any point). Route is a setting of the mode — see `GLOSSARY.md`; "mode" stays reserved for the platform-level ruleset.
- **Scoreboard**: local only, with player names entered at the end of a run and remembered for next time. No server, no accounts, no sync — the whole board lives in the browser.
- **Skills each session should consult**: `grilling` and `domain-modeling` for HITL tickets, `research` for AFK ones, `prototype` for the slice, `tdd` and `codebase-design` for build sessions. Decisions expensive to reverse go in `docs/adr/`.
- **Appetite**: a couple of weeks of evenings. The bar is not "finished" but "genuinely want to play", so the prototype ticket matters more than the last 20% of polish.

## Decisions so far

- [Stack: what mode 1 is built in](issues/01-research-stack.md): TypeScript + Vite + DOM/CSS, no engine — CSS per-character font fallback is what makes four locales cheap; Kaplay runner-up, switch at sprites/particles/audio.

## Not yet specified

- **Tuning numbers**: the speed policy is now a ticket; the actual numbers (ramp rate, ceiling, gate spacing, lane width) are unanswerable before a playable artifact exists and converge with the prototype ticket.
- **Distractor weighting**: the policy (near misses, never repeat) is decided in a ticket; the actual weights and the odd section edges (minor prophets, books with the same name stem) need play data.
- **Art and sound direction**: placeholder geometry and text first. Whether the game needs a visual identity at all to be genuinely fun is unresolved, and only answerable once the loop exists.
- **Mistake-driven practice**: whether a missed book returns within the run or feeds a practice list. Depends on how punishing the loop feels.
- **Accessibility**: keyboard-only play, colourblind-safe gates, reduced motion. Probably cheap, but decide once gate visuals exist.
- **Curriculum beyond mode 1**: sections as a progression path, chapter counts and other Bible knowledge as later modes. Shape unclear until the slice plays.

## Out of scope

- **App Store / Play Store shipping**: mobile is the web build. No signing, review, or per-platform input work in this effort.
- **Any NWT scripture text, footnotes, or study material**: Watch Tower copyright, and not what the game teaches.
- **Accounts, online/cloud leaderboards, sync, multiplayer, ads, monetization**: no backend of any kind. The scoreboard is local storage only.
- **Modes other than Book Order**: the *mode boundary* is in scope; a second mode is a future effort.
- **Native desktop packaging** (Electron/Tauri): the browser is the desktop.
