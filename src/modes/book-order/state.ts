import { BOOKS, type Locale, type SectionId } from '../../content/books';
import { nextRandom, type RandomState } from '../../platform/random';
import type { Action, ReviewItem, RunOptions, RunResult } from '../types';
import {
  LANES,
  ROWS_ON_ROAD,
  ROW_SPACING,
  SPAWN_Z,
  START_BOOST_SPEED,
  START_SPEED,
  climbSpeed,
  rowTravelMs,
} from './rules';
import {
  CANON_LAST_BOOK,
  boardOf,
  firstBookOfRoute,
  firstBookOfSection,
  lastBookOfRoute,
  nextBookOnRoute,
  type RouteId,
} from './routes';

/** A canon Run has reached Revelation and must finish or wrap into Genesis. */
export type Offer = 'finish-or-wrap';

/** Three Gates travelling toward the Runner; exactly one carries the next Book. */
export type Row = {
  /** World distance ahead of the Runner: 0 is the Runner's Lane. */
  readonly z: number;
  /** Canon order per Lane, three Lanes. Exactly one is `answer`. */
  readonly gates: readonly number[];
  /** The Book this Row asks for: the Gate in the Runner's Lane when it arrives. */
  readonly answer: number;
};

export type BookOrderState = {
  /** The PRNG's position, carried in state so `advance` stays pure. */
  readonly rng: RandomState;
  readonly locale: Locale;
  readonly route: RouteId;
  /** Canon order of the Book the Run is at: the last one it reached, or where it began. */
  readonly position: number;
  /** The Lane the Runner occupies, 0..2. */
  readonly lane: number;
  /** Rows on the road, nearest first; the nearest is the one about to arrive. */
  readonly rows: readonly Row[];
  readonly speed: number;
  /** `100 × Speed` per Gate met in the right Lane, rounded and summed; a complete Run does not report it. */
  readonly score: number;
  /** Distractor pairs already shown, so a pair does not repeat within a Run. */
  readonly usedPairs: readonly string[];
  /** Canon orders of the Books this Run met in the wrong Lane, in the order it met them. */
  readonly review: readonly number[];
  readonly offer: Offer | null;
  /** The Run finished at Revelation: a canon-complete Run, which never scores. */
  readonly complete: boolean;
  /** The Run finished its Route with nothing missed: its Route has earned a Start boost. */
  readonly boostEarned: boolean;
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

/** Draws a Row's three Gates: the answer plus two Distractors, lane by lane. */
function drawRow(
  section: SectionId,
  answer: number,
  rng: RandomState,
  usedPairs: readonly string[],
  onRoad: ReadonlySet<number>,
): { gates: number[]; rng: RandomState; usedPairs: readonly string[] } {
  const near = distractorPool(section, answer);
  const unseen = near.filter((order) => !onRoad.has(order));
  // A name already showing on the road is a Gate the Runner cannot tell apart
  // from the answer; a Section too small to avoid every name falls back to it.
  const pool = unseen.length >= LANES - 1 ? unseen : near;
  const pairs = pairsOf(pool);
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

/** Fills the road back to ROWS_ON_ROAD, each new Row asking the Book after the farthest. */
function topUp(state: BookOrderState): BookOrderState {
  // The whole chain of answers is known before the draw, so a distractor can
  // never be another Row's answer: a name on two Gates is a name to misread.
  const answers = state.rows.map((row) => row.answer);
  while (answers.length < ROWS_ON_ROAD) {
    answers.push(nextBookOnRoute(state.route, answers[answers.length - 1] ?? state.position));
  }
  const onRoad = new Set([...answers, ...state.rows.flatMap((row) => row.gates)]);

  let rows = state.rows;
  let rng = state.rng;
  let usedPairs = state.usedPairs;

  while (rows.length < ROWS_ON_ROAD) {
    const answer = answers[rows.length];
    const draw = drawRow(sectionOf(answer), answer, rng, usedPairs, onRoad);

    const z = (rows[rows.length - 1]?.z ?? 0) + ROW_SPACING;
    rows = [...rows, { z, gates: draw.gates, answer }];
    for (const order of draw.gates) onRoad.add(order);
    rng = draw.rng;
    usedPairs = draw.usedPairs;
  }

  return { ...state, rows, rng, usedPairs };
}

/** Steers the Runner one Lane; a press into an edge leaves it where it is. */
function steer(state: BookOrderState, action: Action | null): BookOrderState {
  const lane =
    action?.type === 'left'
      ? Math.max(0, state.lane - 1)
      : action?.type === 'right'
        ? Math.min(LANES - 1, state.lane + 1)
        : state.lane;
  return lane === state.lane ? state : { ...state, lane };
}

/** Judges the nearest Row in the Lane the Runner occupies and takes it off the road. */
function judge(state: BookOrderState): BookOrderState {
  const [row, ...rows] = state.rows;

  if (row.gates[state.lane] !== row.answer) {
    const review = state.review.includes(row.answer)
      ? state.review
      : [...state.review, row.answer];
    return { ...state, rows, review };
  }

  const position = row.answer;
  const finishedLap =
    state.route !== 'canon' &&
    position === lastBookOfRoute(state.route) &&
    state.review.length === 0;

  return {
    ...state,
    rows,
    position,
    // The Gate is worth the Speed it arrived at, not the Speed it earns.
    score: state.score + Math.round(state.speed * 100),
    speed: climbSpeed(state.speed),
    boostEarned: state.boostEarned || finishedLap,
    offer: state.route === 'canon' && position === CANON_LAST_BOOK ? 'finish-or-wrap' : null,
  };
}

export function createRun(options: RunOptions, locale: Locale): BookOrderState {
  const route = options.route;
  const position =
    options.route === 'canon'
      ? firstBookOfSection(options.start).order
      : firstBookOfRoute(options.route);

  return topUp({
    rng: options.seed >>> 0,
    locale,
    route,
    position,
    lane: 1,
    rows: [],
    speed: options.startBoost === true ? START_BOOST_SPEED : START_SPEED,
    score: 0,
    usedPairs: [],
    review: [],
    // Beginning at Revelation is already reaching it: the first choice is finish-or-wrap.
    offer: route === 'canon' && position === CANON_LAST_BOOK ? 'finish-or-wrap' : null,
    complete: false,
    boostEarned: false,
    over: false,
  });
}

export function advance(
  state: BookOrderState,
  dtMs: number,
  action: Action | null,
): BookOrderState {
  if (state.over) return state;

  if (state.offer !== null) {
    if (action?.type === 'finish') {
      return {
        ...state,
        offer: null,
        complete: true,
        over: true,
        // A Run that passed no Gate travelled no Route, so finishing on the offer
        // a Run beginning at Revelation opens at once earns no Start boost.
        boostEarned: state.review.length === 0 && state.score > 0,
      };
    }
    if (action?.type === 'wrap') return { ...state, offer: null };
    return state;
  }

  const steered = steer(state, action);
  if (!(dtMs > 0)) return steered;

  const dz = Math.max(0, dtMs) * (SPAWN_Z / rowTravelMs(steered.speed));
  let next: BookOrderState = {
    ...steered,
    rows: steered.rows.map((row) => ({ ...row, z: row.z - dz })),
  };
  while (next.offer === null && next.rows.length > 0 && next.rows[0].z <= 0) {
    next = judge(next);
  }
  return topUp(next);
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
    boostEarned: state.boostEarned,
    review,
  };
}
