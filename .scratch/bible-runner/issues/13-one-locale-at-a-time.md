# 13: One Locale at a time

Type: build
Status: resolved
Blocked by: 11

**What to build:** the game can run in any Locale whose copy is finished — and refuses to run in one whose copy is not. A string table holds the interface chrome per Locale; a check asserts every shipped Locale has every key, non-empty; the picker offers only Locales that pass. The choice defaults to the browser's language when that Locale is complete, otherwise English, and is remembered. Book names follow the chosen Locale on every Gate and every Route label.

Development is English, so this ships with `en` alone and the picker shows one entry. That is the point: the mechanism is proven now, and the day the friend's Dutch, Russian or Georgian copy is checked, those Locales appear with no code change.

- [x] Interface chrome comes from a per-Locale string table; no user-visible string is a literal in a component
- [x] The content check fails when a shipped Locale is missing a key, has an empty string, or has strays
- [x] The picker lists only complete Locales
- [x] Default selection is the browser's language when complete, otherwise English
- [x] The chosen Locale survives a reload
- [x] Book names and Route labels render in the chosen Locale, drawn from the content table
- [x] Tests: an incomplete Locale is not offered; a complete Locale renders its own Book names
- [x] There is no fallback branch anywhere — a missing string cannot reach the screen, it stops the Locale being offered

## Answer

Built in `eea25fa, merged at ed22b97`.

Interface chrome moved into a per-Locale table (`strings.json`), completeness enforced by `npm run check:content`, and `strings(locale)` throws rather than lending English words to a missing key — so the fallback branch the spec forbade cannot exist. Platform storage added, one key, all access in `try`/`catch`. Ships with `en` alone.

**Verification**: `npm run build`, `npx vitest run` (56 tests), and `npm run check:content` (content table and interface strings) all green on `integration/book-order`. A two-axis code review of the whole branch raised one missing spec requirement and several structural findings; all were fixed in `a14044f`.
