// mulberry32, five lines and no dependency. Pure: the state goes in and comes
// back out, so a Run replays exactly from its seed.
export type RandomState = number;

export function nextRandom(state: RandomState): { state: RandomState; value: number } {
  const next = (state + 0x6d2b79f5) | 0;
  let value = Math.imul(next ^ (next >>> 15), next | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return { state: next, value: ((value ^ (value >>> 14)) >>> 0) / 4294967296 };
}
