import type { Locale, SectionId } from '../content/books';
import type { BoardId } from '../platform/board';
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
  /** `100 × Speed` per Gate met in the right Lane, rounded, summed. Zero for a complete Run. */
  score: number;
  /** The board this Run scores on; null when it does not score at all. */
  board: BoardId | null;
  /** The Run finished its Route with nothing missed: its Route has earned a Start boost. */
  boostEarned: boolean;
  /** What the end screen lists, in the Mode's own words. */
  review: ReviewItem[];
};

/** What a player did since the last `advance`. */
export type Action =
  | { type: 'left' }
  | { type: 'right' }
  | { type: 'finish' }
  | { type: 'wrap' };

/** Everything a Run needs before it has state. */
export type RunOptions = { seed: number; startBoost?: boolean } & (
  | { route: CourseId }
  | { route: 'canon'; start: SectionId }
);

export interface Mode<S> {
  id: string;
  /** Boards this Mode writes to. The shell never guesses. */
  boards: readonly BoardId[];
  /** The speed-curve version its scores are recorded under; bumping it wipes a board. */
  curve: number;
  createRun(options: RunOptions, locale: Locale): S;
  /** Pure: same state and input, same result. No clock, no randomness, no DOM. */
  advance(state: S, dtMs: number, action: Action | null): S;
  /** Writes into its own host element only. */
  render(state: S, host: HTMLElement, dispatch: (action: Action) => void): void;
  result(state: S): RunResult;
}
