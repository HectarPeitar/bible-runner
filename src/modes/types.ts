import type { Locale, SectionId } from '../content/books';
import type { CourseId } from './book-order/routes';

export type ReviewItem = {
  /** Canon position, 1..66. */
  order: number;
  /** The Book's name in the Run's Locale. */
  name: string;
};

export type RunResult = {
  over: boolean;
  /** The Run finished at Revelation: a canon-complete Run, which never scores. */
  complete: boolean;
  /** What the end screen lists, in the Mode's own words. */
  review: ReviewItem[];
};

/** What a player did since the last `advance`. */
export type Action =
  | { type: 'pick'; lane: number }
  | { type: 'finish' }
  | { type: 'wrap' };

/** Everything a Run needs before it has state. */
export type RunOptions = { seed: number } & (
  | { route: CourseId }
  | { route: 'canon'; start: SectionId }
);

export interface Mode<S> {
  id: string;
  createRun(options: RunOptions, locale: Locale): S;
  /** Pure: same state and input, same result. No clock, no randomness, no DOM. */
  advance(state: S, dtMs: number, action: Action | null): S;
  /** Writes into its own host element only. */
  render(state: S, host: HTMLElement, dispatch: (action: Action) => void): void;
  result(state: S): RunResult;
}
