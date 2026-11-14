# Map: Bible Runner

## Destination

A spec in this repo a build session can execute without making a new decision: the mode boundary, the four-locale content model, and a locked free-OSS stack — scoped to one mode (Book Order) that a beginner can bring to "I genuinely want to play this" in a couple of weeks of evenings, proven by a thin playable slice.

## Notes

- **Domain**: Bible book order, taught from the New World Translation's canon and naming (Jehovah's Witnesses). NWT is a 66-book canon in Protestant order. Book *names and order only* — never NWT text, footnotes, or study material. Names and the 66-book order are not copyrightable, but jw.org's Terms of Use forbid shipping text transcribed from it, so source data from public-domain Bibles, use jw.org only as a spelling cross-check, and record that decision in the repo. Product name stays generic, with a "not affiliated with Watch Tower" note. Vocabulary in `GLOSSARY.md`.
- **Naming**: the NWT's own names and labels exactly — gates, and the section/course headings. Audience is Bible readers who use the NWT.
- **Locales**: en, nl, ru, ka today, more later — so book names are locale data in one table, never constants in code. The interface language follows the book-name language; chosen by a picker in the shell, defaulting to `navigator.language`. Fonts must cover Latin, Cyrillic, and Georgian (Mkhedruli).
- **Standing preferences**: browser-first static game — no backend, no accounts, no paid services. Mobile means web, not app stores. **Every dependency must be free and open-source with a permissive license**; no paid or closed packages, no proprietary SDKs or assets. Our own code MIT, public repo, GitHub Pages. Beginner game developer: boring and small beats clever.
- **Architecture leanings**: shared shell (title → mode picker → run → result) plus a `Mode` interface; exactly one mode registered, no plugin registry. Stack locked: TypeScript + Vite + DOM/CSS, no engine — pure game core behind a `render(state)` function, so an engine later is a renderer swap.
- **Two routes**: Book Order travels either a **section route** (loops a *course* — one of five groupings of sections, speed climbing) or a **canon route** (whole canon, startable at any one of the ten sections). Course and Section are distinct; see `GLOSSARY.md`. Route is a setting of the mode — see `GLOSSARY.md`; "mode" stays reserved for the platform-level ruleset.
- **Scoreboard**: local only, with player names entered at the end of a run and remembered for next time. No server, no accounts, no sync — the whole board lives in the browser.
- **Skills each session should consult**: `grilling` and `domain-modeling` for HITL tickets, `research` for AFK ones, `prototype` for the slice, `tdd` and `codebase-design` for build sessions. Decisions expensive to reverse go in `docs/adr/`.
- **Appetite**: a couple of weeks of evenings. The bar is not "finished" but "genuinely want to play", so the prototype ticket matters more than the last 20% of polish.

## Decisions so far

- [Build the localized content table](issues/03-task-content-table.md): 66 rows in `src/content/books.json` with one NWT name per locale, order/section/chapters, checked by `npm run check:content` (no two books may share a name in a locale).
- [Architecture and mode boundary](issues/05-platform-architecture.md): a mode is a pure `advance(state, dt, action)` plus a `render(state, host)`; the shell owns screens, storage, locale and names. Written up as [`docs/adr/0001`](../docs/adr/0001-stack-and-mode-boundary.md).
- [Who translates, and what happens when a string is missing](issues/06-i18n-policy.md): English-only development, translation as a release gate, no fallback (a locale ships complete or not at all), and **routes labelled by book range** so the game invents no vocabulary.
- [Local scoreboard: entries, names, and when it prompts](issues/09-scoreboard.md): six boards (one per route), top 10, names for a shared PC, score = 100 × speed per gate rounded, and boards carry the speed-curve version so retuning wipes them honestly.
- [Pin the Book Order run loop](issues/04-mode-1-loop.md): 3 lanes, one correct of three, 3 lives, and a wrong pick *bounces* — no book can be skipped, so order is never broken; speed climbs to a ceiling and multiplies score; start boost earned per route.
- [NWT book names per locale](issues/02-research-nwt-names.md): all 66 captured for en/nl/ru/ka; names diverge badly from common usage (Georgian ~29, Russian 6 + all 21 NT), so what a gate prints is its own ticket; two Noto families required, not one.
- [Stack: what mode 1 is built in](issues/01-research-stack.md): TypeScript + Vite + DOM/CSS, no engine — CSS per-character font fallback is what makes four locales cheap; Kaplay runner-up, switch at sprites/particles/audio.

- [Assemble the spec](issues/08-task-spec-assembly.md): [`.scratch/bible-runner/spec.md`](spec.md), ready-for-agent. Written before the slice on the operator's call; the tuning numbers are the spec's one declared open end, confined to the Rules module.
- **Model changed (ADR-0002)**: Book Order is steered, not clicked. Rows travel, a Runner moves between Lanes, a wrong Lane is a Stumble that pushes you back and slows the world while the right Gate is marked green, and the only failure is being Caught. `Life` and `Bounce` are retired. `17` and `18` are resolved on `integration/runner-model` (2f46462): Rows travel, the Runner steers, a Stumble pushes the Row back at half speed with the answer lit green, and Caught is the only failure. Frontier is now [`16`](issues/16-set-the-numbers-by-playing.md), the tuning pass, which needs the operator at the keyboard. [`11`](issues/11-a-run-you-can-play.md) is superseded; 12–15 stand.
- **Build complete except the tuning**: tickets 11–15 resolved on `integration/book-order` (56 tests, build and content checks green), after a two-axis review whose findings were fixed in `a14044f`. Only [ticket 16](issues/16-set-the-numbers-by-playing.md) remains, and it needs the operator at the keyboard: the tuning numbers cannot be set from a desk.
- **Build tickets issued**: the spec is cut into six vertical slices, [`11`](issues/11-a-run-you-can-play.md) → [`16`](issues/16-set-the-numbers-by-playing.md). Frontier is `11`: a playable Run on the Gospels Section. `07` was absorbed rather than duplicated — its build half is `11`, its verdict half is `16`.

## Not yet specified

- **Tuning numbers**: the speed policy is now a ticket; the actual numbers (ramp rate, ceiling, gate spacing, lane width) are unanswerable before a playable artifact exists and converge with the prototype ticket.
- **Distractor weighting**: the policy (near misses, never repeat) is decided in a ticket; the actual weights and the odd section edges (minor prophets, books with the same name stem) need play data.
- **Art and sound direction**: placeholder geometry and text first. Whether the game needs a visual identity at all to be genuinely fun is unresolved, and only answerable once the loop exists.
- **Practice beyond a run**: bounced books are reviewed on the end screen, but whether they later feed a drilling mode (or the run itself) is unshaped.
- **Accessibility**: keyboard-only play, colourblind-safe gates, reduced motion. Probably cheap, but decide once gate visuals exist.
- **Curriculum beyond mode 1**: sections as a progression path, chapter counts and other Bible knowledge as later modes. Shape unclear until the slice plays.

## Out of scope

- **App Store / Play Store shipping**: mobile is the web build. No signing, review, or per-platform input work in this effort.
- **Any NWT scripture text, footnotes, or study material**: Watch Tower copyright, and not what the game teaches.
- **Accounts, online/cloud leaderboards, sync, multiplayer, ads, monetization**: no backend of any kind. The scoreboard is local storage only.
- **Modes other than Book Order**: the *mode boundary* is in scope; a second mode is a future effort.
- **Native desktop packaging** (Electron/Tauri): the browser is the desktop.
