# Who translates, and what happens when a string is missing

Type: grilling
Status: resolved
Blocked by:

## Question

**Settled by the operator:** a friend checks the translations, at a later stage — and **all development happens in English**.

Still to pin: the shape of the string tables, what a missing string does, and whether the locale can change mid-run.

## Answer

### Development is English-only

Every authoring decision, test and playtest happens in `en`. Translation is a **release gate, not a development dependency** — nothing in the build path ever waits for the friend, and a locale that has not been checked simply isn't offered. That keeps the friend's evening off the critical path and means their verdict arrives once, against finished copy, instead of chasing strings that move weekly.

Book names are **not** translation work: all 66 are already transcribed from the NWT's own per-locale tables ([names research](../../../research/nwt-book-names.md), built into [the content table](03-task-content-table.md)). What the friend checks is the small set of interface strings, which is where the game says things in its own voice.

### The ten section names were the real risk — so they are gone

The NWT has *Hebrew-Aramaic Scriptures* and *Christian Greek Scriptures*. It does **not** have "Law", "History", "Wisdom", "Major Prophets" or "Epistles" — those are study groupings, and their Georgian and Russian forms would be vocabulary this project invented and then taught to people whose reason for playing is learning correct vocabulary. Invented labels are a correctness risk, not a typo risk, and the friend would be asked to bless words that have no source.

So **routes and start points are labelled by book range, not by name**:

| Route | Label |
|---|---|
| course 1 | Genesis–Song of Solomon |
| course 2 | Isaiah–Malachi |
| course 3 | Romans–Jude |
| course 4 | Genesis–Malachi |
| course 5 | Matthew–Revelation |
| canon | Genesis–Revelation |

Every one of those words is a book name that is already checked and already translated in all four locales, joined by a dash. Nothing is invented, nothing needs a translator, and the label teaches the boundary books — which is exactly what Book Order is about. The ten start points read the same way: `Genesis–Deuteronomy`, `Joshua–Esther`, and so on.

That leaves roughly ten chrome strings (*Play, Scores, Pause, Try again, Game over, Name, Speed, Lives*), and those are ordinary UI copy.

### String tables

One file, `src/content/strings.ts`: a `Record<Locale, Record<StringKey, string>>` of plain objects. **No i18n library** — the set is small, the keys are static, and a dependency here would be a dependency to audit, version and license-check for no benefit.

### No fallback, because no partial locale ships

A locale is either complete or absent from the picker. There is no English-under-the-Dutch case, because there is no such state: if `nl` is missing a key, `nl` is not offered.

Completeness is a check, not a promise: [the content checker](03-task-content-table.md) grows a second pass over `strings.ts` asserting every locale has every key, non-empty and trimmed. Same zero-dependency script, same habit as the book table.

### Locale is chosen before a run and fixed during it

Book names *are* the game's vocabulary, so switching language mid-run would rename the gates the player is about to meet — that is a rules change wearing a display change's clothes. Chosen on the picker, remembered in `localStorage`, changeable between runs.

Default: `navigator.language` if that locale is complete, otherwise `en`.

### What the friend is actually signing off

Not "is this good Dutch" alone, but: does each chrome string read as normal, non-machine copy in a game, and — when the first non-English locale turns on — **does it render**: Latin, Cyrillic and Georgian Mkhedruli come from two font families, and Georgian must never be `text-transform: uppercase` (Mtavruli casing mangles mixed strings like `1 სამუელი`). Font coverage is verified at that moment, on a real screen, not assumed.
