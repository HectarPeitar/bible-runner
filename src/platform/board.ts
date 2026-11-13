// The six local boards, one per Route. Pure: the shell hands in what it read from
// storage and writes back what it gets, so no board code touches localStorage.

export type BoardId =
  | 'law-history-wisdom'
  | 'prophets'
  | 'epistles'
  | 'hebrew-scriptures'
  | 'greek-scriptures'
  | 'canon';

export type ScoreEntry = {
  name: string;
  score: number;
  /** When the Run ended: equal scores rank the earlier Run higher. */
  at: number;
};

/** A board as stored: the speed curve it was recorded under, and its best ten. */
export type Board = { curve: number; entries: ScoreEntry[] };

/** A board keeps ten; the result screen shows three. */
export const BOARD_SIZE = 10;
export const SHOWN = 3;

/** Trimmed, 1–16 characters, any script, no control characters; empty is Anonymous. */
export const NAME_MAX = 16;
export const ANONYMOUS = 'Anonymous';

const CONTROL = /\p{Cc}/gu;

export function cleanName(raw: string): string {
  const name = Array.from(raw.replace(CONTROL, '').trim())
    .slice(0, NAME_MAX)
    .join('')
    .trim();
  return name === '' ? ANONYMOUS : name;
}

/** The entries a board shows under this speed curve: a bumped curve clears them. */
export function entriesOf(board: Board | undefined, curve: number): readonly ScoreEntry[] {
  return board !== undefined && board.curve === curve ? board.entries : [];
}

const ranked = (a: ScoreEntry, b: ScoreEntry): number => b.score - a.score || a.at - b.at;

/** A full board keeps its ten best, so an equal score below them does not qualify. */
export function qualifies(entries: readonly ScoreEntry[], score: number): boolean {
  if (entries.length < BOARD_SIZE) return true;
  return score > Math.min(...entries.map((entry) => entry.score));
}

/** Records a score on its board; a stale curve starts that board again. */
export function recordScore(board: Board | undefined, curve: number, entry: ScoreEntry): Board {
  const entries = [...entriesOf(board, curve), { ...entry, name: cleanName(entry.name) }]
    .sort(ranked)
    .slice(0, BOARD_SIZE);
  return { curve, entries };
}
