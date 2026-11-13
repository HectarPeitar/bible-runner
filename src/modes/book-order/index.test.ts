import { describe, expect, it } from 'vitest';
import { BOOKS, SECTION_ORDER, type SectionId } from '../../content/books';
import { BOOK_ORDER } from './index';
import type { BookOrderState } from './state';
import { SPEED_CEILING, START_BOOST_SPEED, START_SPEED } from './rules';
import { ROUTES, routeBooks, routeLabel, sectionLabel, type CourseId } from './routes';

const gospels = BOOKS.filter((book) => book.section === 'gospels');
const canon = (start: SectionId, seed = 11) =>
  BOOK_ORDER.createRun({ seed, route: 'canon', start }, 'en');
const start = (seed = 11) => canon('gospels', seed);
const startCourse = (route: CourseId, seed = 11) => BOOK_ORDER.createRun({ seed, route }, 'en');
const pick = (state: BookOrderState, lane: number) =>
  BOOK_ORDER.advance(state, 0, { type: 'pick', lane });
const correctLane = (state: BookOrderState) => state.gates.indexOf(state.answer);
const wrongLane = (state: BookOrderState) => (correctLane(state) + 1) % state.gates.length;
const pass = (state: BookOrderState) => pick(state, correctLane(state));
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

describe('Book Order: a Run on the Gospels', () => {
  it('starts on the Gospels with three Gates, one of them the next Book', () => {
    const state = start();
    expect(state.gates).toHaveLength(3);
    expect(state.position).toBe(gospels[0].order);
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
      let state = canon('gospels', seed);
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
    for (let beat = 0; beat < 3; beat += 1) {
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

  it('a Course that runs out returns to its first Book rather than stopping', () => {
    const route = 'isaiah-malachi';
    let state = startCourse(route);
    for (let beat = 0; beat < routeBooks(route).length; beat += 1) {
      state = pass(state);
      expect(BOOK_ORDER.result(state).over).toBe(false);
    }
    expect(state.answer).toBe(routeBooks(route)[1]);
  });

  it('a Section with fewer than three Books produces three Gates anyway', () => {
    let state = canon('general');
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);
    expect(state.gates).toHaveLength(3);
    expect(state.gates).toContain(state.answer);
    expect(new Set(state.gates).size).toBe(3);
  });

  it('keeps the Speed climbing toward a ceiling instead of forever', () => {
    let state = startCourse('genesis-malachi');
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
      expect(state.position).toBe(
        BOOKS.filter((book) => book.section === section)[0].order,
      );
    }
  });

  it('visits every Book in a Course’s range exactly once per lap, in order', () => {
    for (const { route, first, last } of COURSE_RANGES) {
      const range = Array.from({ length: last - first + 1 }, (_unused, at) => first + at);
      let state = startCourse(route);
      const visited: number[] = [];
      for (let beat = 0; beat < range.length; beat += 1) {
        visited.push(state.answer);
        state = pass(state);
      }
      expect(visited).toEqual([...range.slice(1), range[0]]);
      expect(state.answer).toBe(range[1]);
      expect(BOOK_ORDER.result(state).over).toBe(false);
    }
  });

  it('a Course Run never ends except by Lives, and never offers finish-or-wrap', () => {
    const route = 'matthew-revelation';
    let state = startCourse(route);
    for (let beat = 0; beat < 3 * routeBooks(route).length; beat += 1) {
      expect(state.offer).toBeNull();
      state = pass(state);
    }
    expect(state.lives).toBe(3);
    expect(BOOK_ORDER.result(state).over).toBe(false);
  });

  it('reaching Revelation offers finish-or-wrap, and only once per pass', () => {
    let state = canon('general');
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);
    expect(state.offer).toBeNull();
    state = pass(state);

    expect(state.offer).toBe('finish-or-wrap');
    expect(state.over).toBe(false);
    expect(BOOK_ORDER.advance(state, 10_000, null).offer).toBe('finish-or-wrap');
    expect(pick(state, 0).offer).toBe('finish-or-wrap');

    const wrapped = wrap(state);
    expect(wrapped.offer).toBeNull();
    expect(wrapped.answer).toBe(BOOKS[0].order);

    let lap = wrapped;
    for (let beat = 0; beat < BOOKS.length - 1; beat += 1) {
      expect(lap.offer).toBeNull();
      lap = pass(lap);
    }
    expect(lap.answer).toBe(BOOKS[BOOKS.length - 1].order);
    expect(lap.offer).toBeNull();

    lap = pass(lap);
    expect(lap.offer).toBe('finish-or-wrap');
  });

  it('wrapping continues the same Run without losing Lives or Speed', () => {
    let state = canon('general');
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);
    state = pass(state);
    const wrapped = wrap(state);

    expect(wrapped.lives).toBe(state.lives);
    expect(wrapped.speed).toBe(state.speed);
    expect(wrapped.review).toEqual(state.review);
    expect(BOOK_ORDER.result(wrapped).over).toBe(false);
  });

  it('finishing at Revelation reports the Run complete, with no score', () => {
    let state = canon('general');
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);
    state = pass(state);

    const result = BOOK_ORDER.result(finish(state));
    expect(result.over).toBe(true);
    expect(result.complete).toBe(true);
    expect(result.board).toBeNull();
    expect(result.score).toBe(0);
  });

  it('a canon Run that begins at Revelation offers finish-or-wrap immediately', () => {
    const state = canon('revelation');

    expect(state.position).toBe(BOOKS[BOOKS.length - 1].order);
    expect(state.offer).toBe('finish-or-wrap');
    expect(BOOK_ORDER.result(finish(state)).complete).toBe(true);
  });
});

describe('Book Order: the score and its board', () => {
  it('a correct pick scores 100 × Speed, rounded, and the total is an integer', () => {
    const first = pass(start());
    expect(BOOK_ORDER.result(first).score).toBe(100);

    const second = pass(first);
    expect(BOOK_ORDER.result(second).score).toBe(300);
    expect(Number.isInteger(BOOK_ORDER.result(second).score)).toBe(true);
  });

  it('a Bounce awards nothing for the row it spoiled, and keeps the score earned so far', () => {
    let state = pass(start());
    const earned = BOOK_ORDER.result(state).score;

    state = pick(state, wrongLane(state));
    state = pass(state);

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
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);
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

  it('a Run that Bounced earns nothing, even when it reaches Revelation and finishes', () => {
    let state = canon('general');
    state = pass(pick(state, wrongLane(state)));
    while (state.answer !== BOOKS[BOOKS.length - 1].order) state = pass(state);

    expect(BOOK_ORDER.result(finish(pass(state))).boostEarned).toBe(false);
  });

  it('a Run that ends by losing the third Life earns nothing', () => {
    let state = start();
    for (let life = 0; life < 3; life += 1) {
      state = pick(state, wrongLane(state));
      if (life < 2) state = pass(state);
    }

    const result = BOOK_ORDER.result(state);
    expect(result.over).toBe(true);
    expect(result.boostEarned).toBe(false);
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
    expect(state.answer).toBe(books[0]);

    expect(BOOK_ORDER.result(pass(state)).boostEarned).toBe(true);
  });

  it('a Course lap that Bounced earns nothing', () => {
    const route = 'romans-jude';
    const books = routeBooks(route);
    let state = startCourse(route);
    state = pass(pick(state, wrongLane(state)));
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
    expect(boosted.gates).toEqual(start().gates);
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
    for (let life = 0; life < 3; life += 1) {
      missed.push(state.answer);
      state = pick(state, wrongLane(state));
      if (life < 2) state = pass(state);
    }

    const names = BOOK_ORDER.result(state).review.map((item) => item.name);
    const canonical = [...missed].sort((a, b) => a - b);
    expect(names).toEqual(canonical.map((order) => BOOKS[order - 1].names.ka));
    expect(names).not.toEqual(canonical.map((order) => BOOKS[order - 1].names.en));
  });
});
