# Architecture and mode boundary

Type: grilling
Status: open
Blocked by: 01, 04

## Question

How the pieces sit in code, at a level a beginner can navigate: the shell (title → mode picker → run → result), what the `Mode` interface receives and returns, where the locale comes from and where it is persisted, where the high score lives, and the file layout.

Cover: how a mode reports its score, what the shell does when a locale is missing a string, and where the content table is imported from. Record the stack and the boundary together as one ADR in `docs/adr/` — both are expensive to reverse.

## Answer
