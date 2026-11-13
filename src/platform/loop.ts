/** A tab switch must not teleport Gates behind the player's back. */
const MAX_FRAME_MS = 100;

/** Runs `step` once per animation frame until it returns false. */
export function startLoop(step: (dtMs: number) => boolean): () => void {
  let last: number | null = null;
  let handle = 0;

  const frame = (now: number): void => {
    const dtMs = last === null ? 0 : Math.min(now - last, MAX_FRAME_MS);
    last = now;
    if (step(dtMs)) handle = requestAnimationFrame(frame);
  };

  handle = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(handle);
}
