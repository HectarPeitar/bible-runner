import { BOOKS, type Locale, type SectionId, type Book } from '../../content/books';
import { nextRandom, type RandomState } from '../../platform/random';
import type { Action, ReviewItem, RunOptions, RunResult } from '../types';
import { LANES, LIVES, START_SPEED, climbSpeed, rowTravelMs } from './rules';

export type BookOrderState = {
  /** The PRNG's position, carried in state so `advance` stays pure. */
  readonly rng: RandomState;
  readonly locale: Locale;
  readonly section: SectionId;
  /** Canon order of the next Book: the correct Gate on this row. */
  readonly answer: number;
  /** Canon order per lane, three lanes. Exactly one is the answer. */
  readonly gates: readonly number[];
  readonly lives: number;
  readonly speed: number;
  /** A Bounce marked the correct Gate; only tapping it continues the Run. */
  readonly marked: boolean;
  /** Distractor pairs already shown, so a pair does not repeat within a Run. */
  readonly usedPairs: readonly string[];
  /** Canon orders of the Books this Run missed, in the order they were missed. */
  readonly review: readonly number[];
  /** Time this row has spent travelling toward the player. */
  readonly beatMs: number;
  readonly over: boolean;
};

const booksOf = (section: SectionId): readonly Book[] =>
  BOOKS.filter((book) => book.section === section);

/** The Book after `order` inside the Section, wrapping to its first Book. */
export function nextInSection(section: SectionId, order: number): number {
  const books = booksOf(section);
  const at = books.findIndex((book) => book.order === order);
  return books[(at + 1) % books.length].order;
}

/** The Book before `order` inside the Section, wrapping to its last Book. */
export function previousInSection(section: SectionId, order: number): number {
  const books = booksOf(section);
  const at = books.findIndex((book) => book.order === order);
  return books[(at - 1 + books.length) % books.length].order;
}

/** Candidate Distractors: the answer's own Section, or its nearest neighbours. */
function distractorPool(section: SectionId, answer: number): number[] {
  const peers = BOOKS.filter(
    (book) => book.section === section && book.order !== answer,
  ).map((book) => book.order);
  if (peers.length >= LANES - 1) return peers;
  // A Section with fewer than three Books borrows the nearest Books by canon
  // position, so the choice is still about where a Book sits.
  const nearest = BOOKS.filter((book) => book.section !== section)
    .sort((a, b) => Math.abs(a.order - answer) - Math.abs(b.order - answer))
    .map((book) => book.order);
  return [...peers, ...nearest];
}

const pairKey = (pair: readonly number[]): string => [...pair].sort((a, b) => a - b).join('-');

function pairsOf(pool: readonly number[]): number[][] {
  const pairs: number[][] = [];
  for (let first = 0; first < pool.length; first += 1) {
    for (let second = first + 1; second < pool.length; second += 1) {
      pairs.push([pool[first], pool[second]]);
    }
  }
  return pairs;
}

/** Draws the row of three Gates: the answer plus two Distractors, lane by lane. */
function drawRow(
  section: SectionId,
  answer: number,
  rng: RandomState,
  usedPairs: readonly string[],
): { gates: number[]; rng: RandomState; usedPairs: readonly string[] } {
  const pairs = pairsOf(distractorPool(section, answer));
  const fresh = pairs.filter((pair) => !usedPairs.includes(pairKey(pair)));
  // shortcut: a four-Book Section runs out of fresh Distractor pairs after
  // three laps, so a long Run reuses one; upgrade if a player outlasts that.
  const choices = fresh.length > 0 ? fresh : pairs;

  const pairDraw = nextRandom(rng);
  const pair = choices[Math.floor(pairDraw.value * choices.length)];

  const laneDraw = nextRandom(pairDraw.state);
  const answerLane = Math.floor(laneDraw.value * LANES);
  const orderDraw = nextRandom(laneDraw.state);
  const distractors = orderDraw.value < 0.5 ? [pair[1], pair[0]] : [pair[0], pair[1]];

  const gates: number[] = [];
  let next = 0;
  for (let lane = 0; lane < LANES; lane += 1) {
    gates.push(lane === answerLane ? answer : distractors[next++]);
  }

  return {
    gates,
    rng: orderDraw.state,
    usedPairs: [...usedPairs, pairKey(pair)],
  };
}

/** Starts the row for `state.answer`: a new row is a new beat. */
function beginRow(state: BookOrderState): BookOrderState {
  const draw = drawRow(state.section, state.answer, state.rng, state.usedPairs);
  return {
    ...state,
    rng: draw.rng,
    gates: draw.gates,
    usedPairs: draw.usedPairs,
    marked: false,
    beatMs: 0,
  };
}

export function createRun(options: RunOptions, locale: Locale): BookOrderState {
  const first = booksOf(options.section)[0];
  if (first === undefined) throw new Error(`Section "${options.section}" has no Books`);
  return beginRow({
    rng: options.seed >>> 0,
    locale,
    section: options.section,
    // The Run starts on the Section's first Book, so the first row asks for the second.
    answer: nextInSection(options.section, first.order),
    gates: [],
    lives: LIVES,
    speed: START_SPEED,
    marked: false,
    usedPairs: [],
    review: [],
    beatMs: 0,
    over: false,
  });
}

export function advance(
  state: BookOrderState,
  dtMs: number,
  action: Action | null,
): BookOrderState {
  if (state.over) return state;

  const pickedLane = action?.type === 'pick' ? action.lane : null;

  if (state.marked) {
    // After a Bounce only the marked Gate continues the Run; other taps do nothing.
    if (pickedLane !== null && state.gates[pickedLane] === state.answer) {
      return beginRow({
        ...state,
        answer: nextInSection(state.section, state.answer),
      });
    }
    return state;
  }

  if (pickedLane !== null) {
    if (state.gates[pickedLane] === state.answer) {
      return beginRow({
        ...state,
        answer: nextInSection(state.section, state.answer),
        speed: climbSpeed(state.speed),
      });
    }
    // A Bounce: the row stays, one Life goes, the Speed built so far is lost.
    const lives = state.lives - 1;
    const review = state.review.includes(state.answer)
      ? state.review
      : [...state.review, state.answer];
    if (lives === 0) return { ...state, lives, review, speed: START_SPEED, over: true };
    return { ...state, lives, review, speed: START_SPEED, marked: true };
  }

  const beatMs = Math.min(state.beatMs + Math.max(0, dtMs), rowTravelMs(state.speed));
  return beatMs === state.beatMs ? state : { ...state, beatMs };
}

export function result(state: BookOrderState): RunResult {
  const review: ReviewItem[] = [...state.review]
    .sort((a, b) => a - b)
    .map((order) => ({ order, name: BOOKS[order - 1].names[state.locale] }));
  return { over: state.over, review };
}
