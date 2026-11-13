# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root — it defines `Book`, `Canon`, `Section`, `Course`, `Route`, `Run`, `Gate`, `Distractor`, `Life`, `Mode`, `Locale`, `Bounce`, `Speed`, `Start boost`. These words are load-bearing: `Mode`, `Route` and `Course` mean different things and are easy to conflate.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. `0001-stack-and-mode-boundary.md` fixes the stack and the mode boundary.

Also worth knowing, though not domain docs: `research/` holds the sourcing evidence (NWT book names, stack licensing) and `.scratch/bible-runner/map.md` holds the effort's decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo:

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-stack-and-mode-boundary.md
│   └── ...
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (stack and mode boundary), but worth reopening because…_
