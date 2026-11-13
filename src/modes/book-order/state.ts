import { BOOKS, type Locale, type SectionId } from '../../content/books';
import { nextRandom, type RandomState } from '../../platform/random';
import type { Action, ReviewItem, RunOptions, RunResult } from '../types';
import { LANES, LIVES, START_SPEED, climbSpeed, rowTravelMs } from './rules';
import {
  CANON_FIRST_BOOK,
  CANON_LAST_BOOK,
  boardOf,
  firstBookOfRoute,
  firstBookOfSection,
  nextBookOnRoute,
  type RouteId,
} from './routes';

/** A canon Run has reached Revelation and must finish or wrap into Genesis. */
export type Offer = 'finish-or-wrap';

export type BookOrderState = {
  /** The PRNG's position, carried in state so `advance` stays pure. */
  readonly rng: RandomState;
  readonly locale: Locale;
  readonly route: RouteId;
  /** Canon order of the Book the Run is at: the one just passed, or where it began. */
  readonly position: number;
  /** Canon order of the next Book: the correct Gate on this row. */
  readonly answer: number;
  /** Canon order per lane, three lanes. Exactly one is the answer. */
  readonly gates: readonly number[];
  readonly lives: number;
  readonly speed: number;
  /** `100 × Speed` per correct Gate, rounded and summed; a complete Run does not report it. */
  readonly score: number;
  /** A Bounce marked the correct Gate; only tapping it continues the Run. */
  readonly marked: boolean;
  /** Distractor pairs already shown, so a pair does not repeat within a Run. */
  readonly usedPairs: readonly string[];
  /** Canon orders of the Books this Run missed, in the order they were missed. */
  readonly review: readonly number[];
  /** Time this row has spent travelling toward the player. */
  readonly beatMs: number;
  readonly offer: Offer | null;
  /** The Run finished at Revelation: a canon-complete Run, which never scores. */
  readonly complete: boolean;
  readonly over: boolean;
};

const sectionOf = (order: number): SectionId => BOOKS[order - 1].section;

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
  const draw = drawRow(sectionOf(state.answer), state.answer, state.rng, state.usedPairs);
  return {
    ...state,
    rng: draw.rng,
    gates: draw.gates,
    usedPairs: draw.usedPairs,
    marked: false,
    beatMs: 0,
  };
}

/** A correct Gate advances the Run; reaching Revelation offers finish-or-wrap. */
function passGate(state: BookOrderState): BookOrderState {
  const position = state.answer;
  if (state.route === 'canon' && position === CANON_LAST_BOOK) {
    return beginRow({
      ...state,
      position,
      answer: CANON_FIRST_BOOK,
      offer: 'finish-or-wrap',
    });
  }
  return beginRow({
    ...state,
    position,
    answer: nextBookOnRoute(state.route, position),
  });
}

export function createRun(options: RunOptions, locale: Locale): BookOrderState {
  const route = options.route;
  const position =
    options.route === 'canon'
      ? firstBookOfSection(options.start).order
      : firstBookOfRoute(options.route);

  const state: BookOrderState = {
    rng: options.seed >>> 0,
    locale,
    route,
    position,
    answer: nextBookOnRoute(route, position),
    gates: [],
    lives: LIVES,
    speed: START_SPEED,
    score: 0,
    marked: false,
    usedPairs: [],
    review: [],
    beatMs: 0,
    offer: null,
    complete: false,
    over: false,
  };

  if (options.route === 'canon' && position === CANON_LAST_BOOK) {
    // Beginning at Revelation is already reaching it: the first choice is finish-or-wrap.
    return beginRow({ ...state, answer: CANON_FIRST_BOOK, offer: 'finish-or-wrap' });
  }
  return beginRow(state);
}

export function advance(
  state: BookOrderState,
  dtMs: number,
  action: Action | null,
): BookOrderState {
  if (state.over) return state;

  if (state.offer !== null) {
    if (action?.type === 'finish') {
      return { ...state, offer: null, complete: true, over: true };
    }
    if (action?.type === 'wrap') return { ...state, offer: null };
    return state;
  }

  const pickedLane = action?.type === 'pick' ? action.lane : null;

  if (state.marked) {
    // After a Bounce only the marked Gate continues the Run; other taps do nothing.
    if (pickedLane !== null && state.gates[pickedLane] === state.answer) {
      return passGate(state);
    }
    return state;
  }

  if (pickedLane !== null) {
    if (state.gates[pickedLane] === state.answer) {
      // The Gate is worth the Speed it arrived at, not the Speed it earns.
      const score = state.score + Math.round(state.speed * 100);
      return passGate({ ...state, speed: climbSpeed(state.speed), score });
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
  return {
    over: state.over,
    complete: state.complete,
    score: state.complete ? 0 : state.score,
    board: state.complete ? null : boardOf(state.route),
    review,
  };
}
