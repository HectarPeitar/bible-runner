# Working notes

**Checks.** `npm run check` runs the layer rule, `tsc --noEmit`, `vitest run` and the content checker. It is the same command CI runs, so run it before committing. `npm run build` adds the Vite bundle.

**Screenshots.** `npm run shot` photographs `http://localhost:5173` to `/tmp/book-order.png` using the Chromium already on this machine; pass a URL and a path to photograph something else. The renderer is judged by eye, so this is the normal way to check a visual change. `CHROME_BIN` overrides discovery.

**Git identity.** Use the configured identity. Never pass `-c user.name` or `-c user.email` to a command: commits on a public repo have to be attributable, and an override cannot be undone without rewriting history.

**Stopped subagent runs.** A run that is stopped or fails keeps its unapplied diff at `/tmp/pi-subagents-uid-<uid>/async-subagent-runs/<run-id>/worktree-diffs/step-<n>/task-<n>-<name>.patch`. Apply it rather than re-running the ticket. A slow model editing files is not a stalled worker.

**Shell.** Commands already run in the repository root; there is no need to prefix them with `cd`.
