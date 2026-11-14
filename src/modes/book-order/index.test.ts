import { describe, expect, it } from 'vitest';
import { BOOKS, SECTION_ORDER, type SectionId } from '../../content/books';
import { BOOK_ORDER } from './index';
import type { BookOrderState } from './state';
import {
  LANES,
  ROWS_ON_ROAD,
  SPEED_CEILING,
  START_BOOST_SPEED,
  START_SPEED,
  rowIntervalMs,
} from './rules';
import {
  CANON_LAST_BOOK,
  ROUTES,
  routeBooks,
  routeLabel,
  sectionLabel,
  type CourseId,
} from './routes';

const gospels = BOOKS.filter((book) => book.section === 'gospels');
const canon = (start: SectionId, seed = 11) =>
  BOOK_ORDER.createRun({ seed, route: 'canon', start }, 'en');
const start = (seed = 11) => canon('gospels', seed);
const startCourse = (route: CourseId, seed = 11) => BOOK_ORDER.createRun({ seed, route }, 'en');

/** The Row the Runner meets next: the nearest one on the road. */
const nearest = (state: BookOrderState) => state.rows[0];
const correctLane = (state: BookOrderState) => nearest(state).gates.indexOf(nearest(state).answer);
const wrongLane = (state: BookOrderState) => (correctLane(state) + 1) % LANES;

/** Moves the Runner one Lane per press until it sits in `lane`. */
const steer = (state: BookOrderState, lane: number): BookOrderState => {
  let steering = state;
  while (steering.lane > lane) steering = BOOK_ORDER.advance(steering, 0, { type: 'left' });
  while (steering.lane < lane) steering = BOOK_ORDER.advance(steering, 0, { type: 'right' });
  return steering;
};

/** One beat: the nearest Row reaches the Runner and is judged. */
const arrive = (state: BookOrderState): BookOrderState =>
  BOOK_ORDER.advance(state, rowIntervalMs(state.speed) + 1, null);
const pass = (state: BookOrderState) => arrive(steer(state, correctLane(state)));
const miss = (state: BookOrderState) => arrive(steer(state, wrongLane(state)));
const wrap = (state: BookOrderState) => BOOK_ORDER.advance(state, 0, { type: 'wrap' });
const finish = (state: BookOrderState) => BOOK_ORDER.advance(state, 0, { type: 'finish' });

/** The five Courses and their canon bounds, from the spec's own counts. */
const COURSE_RANGES: readonly { route: CourseId; first: number; last: number }[] = [
  { route: 'genesis-song-of-solomon', first: 1, last: 22 },
  { route: 'isaiah-malachi', first: 23, last: 39 },
  { route: 'romans-jude', first: 45, last: 65 },
  { route: 'genesis-malachi', first: 1, last: 39 },
  { route: 'matthew-revelation', first: 40, last: 66 },
];

describe('Book Order: the road', () => {
  it('starts a Run with Rows on the road, one Gate per Lane, one of them the next Book', () => {
    const state = start();

    expect(state.rows).toHaveLength(ROWS_ON_ROAD);
    expect(state.position).toBe(gospels[0].order);
    expect(nearest(state).answer).toBe(gospels[1].order);
    expect(state.lane).toBe(1);
    for (const row of state.rows) {
      expect(row.z).toBeGreaterThan(0);
      expect(row.gates).toHaveLength(LANES);
      expect(row.gates.filter((order) => order === row.answer)).toHaveLength(1);
      expect(new Set(row.gates).size).toBe(LANES);
    }
    expect(BOOK_ORDER.result(state).over).toBe(false);
  });

  it('asks the canon one Book per Row, in order', () => {
    const state = canon('pauline');
    const answers = state.rows.map((row) => row.answer);

    expect(answers).toEqual(state.rows.map((_row, at) => state.position + 1 + at));
  });

  it('brings the Rows toward the Runner without judging them before they arrive', () => {
    const state = start();
    const before = state.rows.map((row) => row.z);
    const travelled = BOOK_ORDER.advance(state, 500, null);

    expect(travelled.rows).toHaveLength(ROWS_ON_ROAD);
    for (const [at, row] of travelled.rows.entries()) {
      expect(row.z).toBeLessThan(before[at]);
      expect(row.z).toBeGreaterThan(0);
    }
    expect(travelled.position).toBe(state.position);
    expect(travelled.score).toBe(0);
    expect(travelled.review).toEqual([]);
  });

  it('keeps a Row’s Gates and Lane place all the way in', () => {
    const state = start(21);
    const gates = nearest(state).gates;
    const answer = nearest(state).answer;

    let approaching = state;
    for (let frame = 0; frame < 10; frame += 1) {
      approaching = BOOK_ORDER.advance(approaching, 100, null);
    }

    expect(nearest(approaching).gates).toEqual(gates);
    expect(nearest(approaching).answer).toBe(answer);
    expect(nearest(approaching).z).toBeLessThan(nearest(state).z);
  });

  it('keeps no name on the road twice while the Section has names to spare', () => {
    const state = canon('pauline', 7);
    const names = state.rows.flatMap((row) => row.gates);

    expect(names).toHaveLength(ROWS_ON_ROAD * LANES);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('Book Order: steering', () => {
  it('moves the Runner exactly one Lane per press, and pressing into an edge does nothing', () => {
    let state = start();
    expect(state.lane).toBe(1);

    state = BOOK_ORDER.advance(state, 0, { type: 'left' });
    expect(state.lane).toBe(0);
    state = BOOK_ORDER.advance(state, 0, { type: 'left' });
    expect(state.lane).toBe(0);

    state = BOOK_ORDER.advance(state, 0, { type: 'right' });
    expect(state.lane).toBe(1);
    state = BOOK_ORDER.advance(state, 0, { type: 'right' });
    expect(state.lane).toBe(2);
    state = BOOK_ORDER.advance(state, 0, { type: 'right' });
    expect(state.lane).toBe(2);
  });

  it('steering moves the Runner and nothing else', () => {
    const state = start();

    expect(steer(state, 0)).toMatchObject({
      rows: state.rows,
      position: state.position,
      score: state.score,
      speed: state.speed,
    });
  });

  it('judges a Row in the Lane the Runner is in when it arrives', () => {
    const state = start();
    const lane = correctLane(state);
    const answer = nearest(state).answer;
    const action = lane === 0 ? { type: 'left' as const } : lane === 2 ? { type: 'right' as const } : null;

    const judged = BOOK_ORDER.advance(state, rowIntervalMs(state.speed) + 1, action);

    expect(judged.lane).toBe(lane);
    expect(judged.position).toBe(answer);
    expect(BOOK_ORDER.result(judged).score).toBe(100);
    expect(judged.review).toEqual([]);
  });

  it('a Row met in the wrong Lane scores nothing and puts the Book in the Review', () => {
    const state = start();
    const answer = nearest(state).answer;
    const judged = BOOK_ORDER.advance(
      state,
      rowIntervalMs(state.speed) + 1,
      wrongLane(state) === 0 ? { type: 'left' } : { type: 'right' },
    );

    expect(judged.score).toBe(0);
    expect(judged.position).toBe(state.position);
    expect(BOOK_ORDER.result(judged).review.map((item) => item.order)).toEqual([answer]);
    expect(BOOK_ORDER.result(judged).over).toBe(false);
  });
});

describe('Book Order: a Run on the Gospels', () => {
  it('a correct arrival advances the canon and raises the Speed', () => {
    const before = start();
    const answer = nearest(before).answer;
    const after = pass(before);

    expect(after.position).toBe(answer);
    expect(after.speed).toBeGreaterThan(before.speed);
    expect(BOOK_ORDER.result(after).over).toBe(false);
  });

  it('a Run that meets three Rows in the wrong Lane lists the Books it missed in canon order', () => {
    let state = start();
    const missed: number[] = [];

    for (let row = 0; row < 3; row += 1) {
      missed.push(nearest(state).answer);
      state = miss(state);
    }

    const review = BOOK_ORDER.result(state).review;
    const canonical = [...missed].sort((a, b) => a - b);
    expect(review.map((item) => item.order)).toEqual(canonical);
    expect(review.map((item) => item.name)).toEqual(
      canonical.map((order) => BOOKS[order - 1].names.en),
    );
  });

  it('the same seed and the same key sequence produce the same Run', () => {
    type Move = 'left' | 'right' | 'pass' | 'miss';
    const MOVES: readonly Move[] = ['left', 'pass', 'right', 'miss', 'pass', 'right', 'right', 'pass'];

    const play = (seed: number): BookOrderState =>
      MOVES.reduce((state, move) => {
        if (move === 'pass') return pass(state);
        if (move === 'miss') return miss(state);
        return BOOK_ORDER.advance(state, 0, { type: move });
      }, start(seed));

    const run = (state: BookOrderState) => ({
      rows: state.rows,
      lane: state.lane,
      position: state.position,
      score: state.score,
      speed: state.speed,
      review: state.review,
      rng: state.rng,
    });

    expect(run(play(42))).toEqual(run(play(42)));
    expect(run(play(42))).not.toEqual(run(play(43)));
  });

  it('draws the two Distractors from the answer’s own Section, never the answer', () => {
    let state = canon('pauline', 7);
    for (let row = 0; row < 3; row += 1) {
      const { answer, gates } = nearest(state);
      const distractors = gates.filter((order) => order !== answer);

      expect(distractors).toHaveLength(2);
      expect(new Set(gates).size).toBe(3);
      for (const order of distractors) {
        expect(BOOKS[order - 1].section).toBe(BOOKS[answer - 1].section);
      }
      state = pass(state);
    }
  });

  it('does not repeat a pair of Distractors within a Run', () => {
    let state = canon('pauline', 7);
    const seen = new Set<string>();

    for (let row = 0; row < 4; row += 1) {
      const pair = nearest(state)
        .gates.filter((order) => order !== nearest(state).answer)
        .sort((a, b) => a - b)
        .join('-');
      expect(seen.has(pair)).toBe(false);
      seen.add(pair);
      state = pass(state);
    }
  });

  it('a Course that runs out returns to its first Book rather than stopping', () => {
    const route = 'isaiah-malachi';
    let state = startCourse(route);
    for (let row = 0; row < routeBooks(route).length; row += 1) {
      state = pass(state);
      expect(BOOK_ORDER.result(state).over).toBe(false);
    }
    expect(nearest(state).answer).toBe(routeBooks(route)[1]);
  });

  it('a Section with fewer than three Books produces three Gates anyway', () => {
    let state = canon('general');
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);

    const { gates, answer } = nearest(state);
    expect(gates).toHaveLength(3);
    expect(gates).toContain(answer);
    expect(new Set(gates).size).toBe(3);
  });

  it('keeps the Speed climbing toward a ceiling instead of forever', () => {
    let state = startCourse('genesis-malachi');
    for (let row = 0; row < 100; row += 1) state = pass(state);
    expect(state.speed).toBeLessThan(SPEED_CEILING);
    expect(state.speed).toBeGreaterThan(start().speed);
  });

  it('is pure: advance leaves the state it was given alone', () => {
    const state = start();
    const snapshot = structuredClone(state);

    BOOK_ORDER.advance(state, 16, { type: 'right' });
    pass(state);
    miss(state);

    expect(state).toEqual(snapshot);
    expect(BOOK_ORDER.advance(state, 0, null)).toBe(state);
  });
});

describe('Book Order: Routes', () => {
  it('offers exactly five Courses and the canon, each labelled by Book range', () => {
    expect(ROUTES).toEqual([
      'genesis-song-of-solomon',
      'isaiah-malachi',
      'romans-jude',
      'genesis-malachi',
      'matthew-revelation',
      'canon',
    ]);
    expect(ROUTES.map((route) => routeLabel(route, 'en'))).toEqual([
      'Genesis–Song of Solomon',
      'Isaiah–Malachi',
      'Romans–Jude',
      'Genesis–Malachi',
      'Matthew–Revelation',
      'Genesis–Revelation',
    ]);
  });

  it('labels a Route and a Section in the Run’s Locale, from the content table', () => {
    expect(routeLabel('genesis-song-of-solomon', 'nl')).toBe('Genesis–Hooglied');
    expect(routeLabel('matthew-revelation', 'ru')).toBe('Матфея–Откровение');
    expect(sectionLabel('gospels', 'ka')).toBe('მათე–იოანე');
    expect(sectionLabel('revelation', 'en')).toBe('Revelation');
  });

  it('starts a canon Run at the first Book of any of the ten Sections', () => {
    for (const section of SECTION_ORDER) {
      const state = canon(section, 5);
      expect(state.position).toBe(BOOKS.filter((book) => book.section === section)[0].order);
    }
  });

  it('visits every Book in a Course’s range exactly once per lap, in order', () => {
    for (const { route, first, last } of COURSE_RANGES) {
      const range = Array.from({ length: last - first + 1 }, (_unused, at) => first + at);
      let state = startCourse(route);
      const visited: number[] = [];
      for (let row = 0; row < range.length; row += 1) {
        visited.push(nearest(state).answer);
        state = pass(state);
      }
      expect(visited).toEqual([...range.slice(1), range[0]]);
      expect(nearest(state).answer).toBe(range[1]);
      expect(BOOK_ORDER.result(state).over).toBe(false);
    }
  });

  it('a Course Run never ends by itself, and never offers finish-or-wrap', () => {
    const route = 'matthew-revelation';
    let state = startCourse(route);
    for (let row = 0; row < 3 * routeBooks(route).length; row += 1) {
      expect(state.offer).toBeNull();
      state = pass(state);
    }
    expect(BOOK_ORDER.result(state).over).toBe(false);
  });

  it('reaching Revelation offers finish-or-wrap, and only once per pass', () => {
    let state = canon('general');
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);
    expect(state.offer).toBeNull();
    state = pass(state);

    expect(state.offer).toBe('finish-or-wrap');
    expect(state.over).toBe(false);
    expect(BOOK_ORDER.advance(state, 10_000, null).offer).toBe('finish-or-wrap');
    expect(BOOK_ORDER.advance(state, 0, { type: 'left' }).offer).toBe('finish-or-wrap');

    const wrapped = wrap(state);
    expect(wrapped.offer).toBeNull();
    expect(nearest(wrapped).answer).toBe(BOOKS[0].order);

    let lap = wrapped;
    for (let row = 0; row < BOOKS.length - 1; row += 1) {
      expect(lap.offer).toBeNull();
      lap = pass(lap);
    }
    expect(nearest(lap).answer).toBe(CANON_LAST_BOOK);
    expect(lap.offer).toBeNull();

    lap = pass(lap);
    expect(lap.offer).toBe('finish-or-wrap');
  });

  it('wrapping continues the same Run with the Speed and the score it had', () => {
    let state = canon('general');
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);
    state = pass(state);
    const wrapped = wrap(state);

    expect(wrapped.speed).toBe(state.speed);
    expect(wrapped.score).toBe(state.score);
    expect(wrapped.review).toEqual(state.review);
    expect(BOOK_ORDER.result(wrapped).over).toBe(false);
  });

  it('finishing at Revelation reports the Run complete, with no score', () => {
    let state = canon('general');
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);
    state = pass(state);

    const result = BOOK_ORDER.result(finish(state));
    expect(result.over).toBe(true);
    expect(result.complete).toBe(true);
    expect(result.board).toBeNull();
    expect(result.score).toBe(0);
  });

  it('a canon Run that begins at Revelation offers finish-or-wrap immediately', () => {
    const state = canon('revelation');

    expect(state.position).toBe(CANON_LAST_BOOK);
    expect(state.offer).toBe('finish-or-wrap');
    expect(BOOK_ORDER.result(finish(state)).complete).toBe(true);
  });
});

describe('Book Order: the score and its board', () => {
  it('a correct arrival scores 100 × Speed, rounded, and the total is an integer', () => {
    const first = pass(start());
    expect(BOOK_ORDER.result(first).score).toBe(100);

    const second = pass(first);
    expect(BOOK_ORDER.result(second).score).toBe(300);
    expect(Number.isInteger(BOOK_ORDER.result(second).score)).toBe(true);
  });

  it('a Row met in the wrong Lane awards nothing and keeps the score earned so far', () => {
    let state = pass(start());
    const earned = BOOK_ORDER.result(state).score;

    state = miss(state);

    expect(BOOK_ORDER.result(state).score).toBe(earned);
  });

  it('each Route scores on its own board, and a Course lap never reaches the canon board', () => {
    expect(BOOK_ORDER.boards).toHaveLength(ROUTES.length);
    expect(new Set(BOOK_ORDER.boards).size).toBe(ROUTES.length);
    expect(BOOK_ORDER.boards).toContain('canon');

    const laps = ROUTES.filter((route): route is CourseId => route !== 'canon').map(
      (route) => BOOK_ORDER.result(startCourse(route)).board,
    );
    expect(laps).toEqual([
      'law-history-wisdom',
      'prophets',
      'epistles',
      'hebrew-scriptures',
      'greek-scriptures',
    ]);
    expect(BOOK_ORDER.result(canon('gospels')).board).toBe('canon');
  });
});

describe('Book Order: the Start boost', () => {
  /** A canon Run played clean to Revelation, sitting on the finish-or-wrap offer. */
  const playToRevelation = (seed = 11): BookOrderState => {
    let state = canon('general', seed);
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);
    return pass(state);
  };

  it('a clean canon Run that finishes at Revelation earns a Start boost for its Route', () => {
    const offered = playToRevelation();
    expect(offered.offer).toBe('finish-or-wrap');
    expect(BOOK_ORDER.result(offered).boostEarned).toBe(false);

    const finished = BOOK_ORDER.result(finish(offered));
    expect(finished.over).toBe(true);
    expect(finished.boostEarned).toBe(true);
  });

  it('a Run that missed a Row earns nothing, even when it reaches Revelation and finishes', () => {
    let state = miss(canon('general'));
    while (nearest(state).answer !== CANON_LAST_BOOK) state = pass(state);

    expect(BOOK_ORDER.result(finish(pass(state))).boostEarned).toBe(false);
  });

  it('a clean lap of a Course finishes the Route, and the Run carries on', () => {
    const route = 'isaiah-malachi';
    const books = routeBooks(route);
    let state = startCourse(route);

    while (state.position !== books[books.length - 1]) {
      expect(BOOK_ORDER.result(state).boostEarned).toBe(false);
      state = pass(state);
    }

    expect(BOOK_ORDER.result(state).boostEarned).toBe(true);
    expect(BOOK_ORDER.result(state).over).toBe(false);
    expect(nearest(state).answer).toBe(books[0]);

    expect(BOOK_ORDER.result(pass(state)).boostEarned).toBe(true);
  });

  it('a Course lap that missed a Row earns nothing', () => {
    const route = 'romans-jude';
    const books = routeBooks(route);
    let state = startCourse(route);
    state = miss(state);
    while (state.position !== books[books.length - 1]) state = pass(state);

    expect(BOOK_ORDER.result(state).boostEarned).toBe(false);
  });

  it('accepting the boost starts the Run already moving, and declining starts it normal', () => {
    const boosted = BOOK_ORDER.createRun(
      { seed: 11, route: 'canon', start: 'gospels', startBoost: true },
      'en',
    );
    const declined = BOOK_ORDER.createRun(
      { seed: 11, route: 'canon', start: 'gospels', startBoost: false },
      'en',
    );

    expect(declined.speed).toBe(START_SPEED);
    expect(start().speed).toBe(START_SPEED);
    expect(boosted.speed).toBe(START_BOOST_SPEED);
    expect(boosted.rows).toEqual(start().rows);
    expect(pass(boosted).speed).toBeGreaterThan(START_BOOST_SPEED);
  });

  it('two clean Runs do not stack into a bigger boost', () => {
    const first = BOOK_ORDER.createRun({ seed: 3, route: 'romans-jude', startBoost: true }, 'en');
    const second = BOOK_ORDER.createRun({ seed: 4, route: 'romans-jude', startBoost: true }, 'en');

    expect(first.speed).toBe(START_BOOST_SPEED);
    expect(second.speed).toBe(first.speed);
  });

  it('a Run that passed no Gate earns nothing for finishing at Revelation at once', () => {
    const state = canon('revelation');
    const finished = BOOK_ORDER.result(finish(state));

    expect(finished.complete).toBe(true);
    expect(finished.boostEarned).toBe(false);
  });
});

describe('Book Order: one Locale at a time', () => {
  it('names the Books a Run missed in the Run’s own Locale, drawn from the content table', () => {
    let state = BOOK_ORDER.createRun({ seed: 11, route: 'canon', start: 'gospels' }, 'ka');
    const missed: number[] = [];
    for (let row = 0; row < 3; row += 1) {
      missed.push(nearest(state).answer);
      state = miss(state);
    }

    const names = BOOK_ORDER.result(state).review.map((item) => item.name);
    const canonical = [...missed].sort((a, b) => a - b);
    expect(names).toEqual(canonical.map((order) => BOOKS[order - 1].names.ka));
    expect(names).not.toEqual(canonical.map((order) => BOOKS[order - 1].names.en));
  });
});
