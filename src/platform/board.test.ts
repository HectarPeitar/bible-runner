import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, SHOWN, cleanName, entriesOf, qualifies, recordScore, type Board } from './board';

const entry = (name: string, score: number, at: number) => ({ name, score, at });

describe('board: the best ten of one Route', () => {
  it('a full board keeps its ten best and pushes out the lowest entry', () => {
    let board: Board | undefined;
    for (let run = 1; run <= BOARD_SIZE; run += 1) {
      board = recordScore(board, 1, entry(`Player ${run}`, run * 100, run));
    }
    expect(board?.entries).toHaveLength(BOARD_SIZE);

    board = recordScore(board, 1, entry('Better', 5000, 99));
    expect(board.entries.map((kept) => kept.name)).toEqual([
      'Better',
      'Player 10',
      'Player 9',
      'Player 8',
      'Player 7',
      'Player 6',
      'Player 5',
      'Player 4',
      'Player 3',
      'Player 2',
    ]);
  });

  it('equal scores rank the earlier Run higher, and a full board does not admit a later equal score', () => {
    let board = recordScore(undefined, 1, entry('Earlier', 500, 1));
    board = recordScore(board, 1, entry('Later', 500, 2));

    expect(board.entries.map((kept) => kept.name)).toEqual(['Earlier', 'Later']);

    for (let run = 3; run <= BOARD_SIZE; run += 1) {
      board = recordScore(board, 1, entry(`Player ${run}`, 100, run));
    }
    expect(qualifies(board.entries, 100)).toBe(false);
    expect(qualifies(board.entries, 101)).toBe(true);
  });

  it('shows the top three of a board whose curve is current', () => {
    let board = recordScore(undefined, 1, entry('Sam', 900, 1));
    board = recordScore(board, 1, entry('Ada', 1200, 2));
    board = recordScore(board, 1, entry('Nino', 700, 3));
    board = recordScore(board, 1, entry('Gil', 500, 4));

    expect(SHOWN).toBe(3);
    expect(entriesOf(board, 1).slice(0, SHOWN).map((kept) => kept.name)).toEqual([
      'Ada',
      'Sam',
      'Nino',
    ]);
  });

  it('bumping the speed-curve version clears the board’s entries', () => {
    const recorded = recordScore(undefined, 1, entry('Old', 900, 1));

    expect(entriesOf(recorded, 2)).toEqual([]);
    expect(recordScore(recorded, 2, entry('New', 10, 2)).entries.map((kept) => kept.name)).toEqual([
      'New',
    ]);
  });
});

describe('board: names', () => {
  it('trims, keeps any script, drops control characters, and reads an empty name as Anonymous', () => {
    expect(cleanName('  Sam  ')).toBe('Sam');
    expect(cleanName('ნინო')).toBe('ნინო');
    expect(cleanName('Сэм')).toBe('Сэм');
    expect(cleanName('\u0000\u0007')).toBe('Anonymous');
    expect(cleanName('   ')).toBe('Anonymous');
    expect(cleanName('  Sam\u0007 ')).toBe('Sam');
  });

  it('keeps a name to sixteen characters without splitting a character', () => {
    expect(cleanName('x'.repeat(20))).toBe('x'.repeat(16));
    expect(Array.from(cleanName('😀'.repeat(20)))).toHaveLength(16);
    expect(cleanName('Grace Today Hopper')).toBe('Grace Today Hopp');
  });

  it('records the cleaned name, so no board ever holds a raw one', () => {
    const board = recordScore(undefined, 1, entry('  Sam\u0007 ', 700, 1));
    expect(board.entries).toEqual([{ name: 'Sam', score: 700, at: 1 }]);
  });
});
