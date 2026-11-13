import { describe, expect, it } from 'vitest';
import { BOOKS } from '../../content/books';
import { BOOK_ORDER } from './index';
import type { BookOrderState } from './state';
import { SPEED_CEILING } from './rules';

const gospels = BOOKS.filter((book) => book.section === 'gospels');
const start = (seed = 11) => BOOK_ORDER.createRun({ seed, section: 'gospels' }, 'en');
const pick = (state: BookOrderState, lane: number) =>
  BOOK_ORDER.advance(state, 0, { type: 'pick', lane });
const correctLane = (state: BookOrderState) => state.gates.indexOf(state.answer);
const wrongLane = (state: BookOrderState) => (correctLane(state) + 1) % state.gates.length;
const pass = (state: BookOrderState) => pick(state, correctLane(state));

describe('Book Order: a Run on the Gospels', () => {
  it('starts on the Gospels with three Gates, one of them the next Book', () => {
    const state = start();
    expect(state.gates).toHaveLength(3);
    expect(state.answer).toBe(gospels[1].order);
    expect(state.gates).toContain(state.answer);
    expect(state.lives).toBe(3);
    expect(state.over).toBe(false);
  });

  it('a correct pick advances the row, raises the Speed, and loses no Life', () => {
    const before = start();
    const after = pass(before);
    expect(after.answer).toBe(gospels[2].order);
    expect(after.speed).toBeGreaterThan(before.speed);
    expect(after.lives).toBe(before.lives);
    expect(BOOK_ORDER.result(after).over).toBe(false);
  });

  it('a wrong pick leaves the row in place, returns the same three Gates, marks the correct Gate, and costs one Life', () => {
    const before = start();
    const after = pick(before, wrongLane(before));

    expect(after.gates).toEqual(before.gates);
    expect(after.answer).toBe(before.answer);
    expect(after.lives).toBe(before.lives - 1);
    expect(after.marked).toBe(true);
    expect(after.gates[correctLane(after)]).toBe(after.answer);
    expect(BOOK_ORDER.result(after).over).toBe(false);
  });

  it('tapping the marked Gate resumes the Run, awards nothing for that row, and resets the Speed that was built', () => {
    const built = pass(pass(start()));
    expect(built.speed).toBeGreaterThan(start().speed);

    const bounced = pick(built, wrongLane(built));
    const resumed = pass(bounced);

    expect(resumed.marked).toBe(false);
    expect(resumed.lives).toBe(2);
    expect(resumed.speed).toBe(start().speed);
    expect(resumed.answer).not.toBe(bounced.answer);
  });

  it('losing the third Life ends the Run and lists the missed Books in canonical order', () => {
    let state = start();
    const missed: number[] = [];

    for (let life = 0; life < 3; life += 1) {
      missed.push(state.answer);
      state = pick(state, wrongLane(state));
      if (life < 2) {
        expect({ marked: state.marked, over: BOOK_ORDER.result(state).over }).toEqual({
          marked: true,
          over: false,
        });
        state = pass(state);
      }
    }

    expect(state.lives).toBe(0);
    expect(BOOK_ORDER.result(state).over).toBe(true);

    const review = BOOK_ORDER.result(state).review;
    const canonical = [...missed].sort((a, b) => a - b);
    expect(review.map((item) => item.order)).toEqual(canonical);
    expect(review.map((item) => item.name)).toEqual(
      canonical.map((order) => BOOKS[order - 1].names.en),
    );
  });

  it('the same seed produces the same Gate sequence', () => {
    const playout = (seed: number) => {
      let state = BOOK_ORDER.createRun({ seed, section: 'gospels' }, 'en');
      const rows: (readonly number[])[] = [];
      for (let beat = 0; beat < 4; beat += 1) {
        rows.push(state.gates);
        state = pass(state);
      }
      return rows;
    };

    expect(playout(42)).toEqual(playout(42));
    expect(playout(42)).not.toEqual(playout(43));
  });

  it('draws the two Distractors from the answer’s own Section, never the answer', () => {
    let state = start(7);
    for (let beat = 0; beat < 8; beat += 1) {
      const distractors = state.gates.filter((order) => order !== state.answer);
      expect(distractors).toHaveLength(2);
      expect(new Set(state.gates).size).toBe(3);
      for (const order of distractors) {
        expect(BOOKS[order - 1].section).toBe('gospels');
      }
      state = pass(state);
    }
  });

  it('does not repeat a pair of Distractors within a Run', () => {
    let state = start(7);
    const seen = new Set<string>();
    for (let beat = 0; beat < 4; beat += 1) {
      const pair = state.gates
        .filter((order) => order !== state.answer)
        .sort((a, b) => a - b)
        .join('-');
      expect(seen.has(pair)).toBe(false);
      seen.add(pair);
      state = pass(state);
    }
  });

  it('a Section that runs out returns to its first Book rather than stopping', () => {
    let state = start();
    for (let beat = 0; beat < gospels.length; beat += 1) {
      state = pass(state);
      expect(BOOK_ORDER.result(state).over).toBe(false);
    }
    expect(state.answer).toBe(gospels[1].order);
  });

  it('a Section with fewer than three Books produces three Gates anyway', () => {
    const state = BOOK_ORDER.createRun({ seed: 3, section: 'acts' }, 'en');
    expect(state.gates).toHaveLength(3);
    expect(state.gates).toContain(state.answer);
    expect(new Set(state.gates).size).toBe(3);
  });

  it('keeps the Speed climbing toward a ceiling instead of forever', () => {
    let state = start();
    for (let beat = 0; beat < 100; beat += 1) state = pass(state);
    expect(state.speed).toBeLessThan(SPEED_CEILING);
    expect(state.speed).toBeGreaterThan(start().speed);
  });

  it('time travels the row toward the player and never advances it', () => {
    const state = start();
    const arrived = BOOK_ORDER.advance(state, 10_000, null);

    expect(arrived.beatMs).toBeGreaterThan(state.beatMs);
    expect(arrived.answer).toBe(state.answer);
    expect(arrived.gates).toEqual(state.gates);
    expect(BOOK_ORDER.advance(arrived, 10_000, null).beatMs).toBe(arrived.beatMs);
  });

  it('is pure: advance leaves the state it was given alone', () => {
    const state = start();
    const snapshot = structuredClone(state);
    pick(state, wrongLane(state));
    pass(state);
    BOOK_ORDER.advance(state, 16, null);
    expect(state).toEqual(snapshot);
  });
});
