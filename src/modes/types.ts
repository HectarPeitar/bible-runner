import type { Locale, SectionId } from '../content/books';

export type ReviewItem = {
  /** Canon position, 1..66. */
  order: number;
  /** The Book's name in the Run's Locale. */
  name: string;
};

export type RunResult = {
  over: boolean;
  /** What the end screen lists, in the Mode's own words. */
  review: ReviewItem[];
};

/** What a player did since the last `advance`. */
export type Action = { type: 'pick'; lane: number };

/** Everything a Run needs before it has state. */
export type RunOptions = {
  /** Seeds the Run's PRNG, so a Run replays from its seed. */
  seed: number;
  /** The Section a Run travels. Ticket 11 plays the Gospels only. */
  section: SectionId;
};

export interface Mode<S> {
  id: string;
  createRun(options: RunOptions, locale: Locale): S;
  /** Pure: same state and input, same result. No clock, no randomness, no DOM. */
  advance(state: S, dtMs: number, action: Action | null): S;
  /** Writes into its own host element only. */
  render(state: S, host: HTMLElement, dispatch: (action: Action) => void): void;
  result(state: S): RunResult;
}
