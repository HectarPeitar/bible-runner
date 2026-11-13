import { SECTION_ORDER, type SectionId } from '../content/books';
import { BOOK_ORDER } from '../modes/book-order';
import { ROUTES, routeLabel, sectionLabel } from '../modes/book-order/routes';
import type { BookOrderState } from '../modes/book-order/state';
import type { Action, RunOptions } from '../modes/types';
import { startLoop } from '../platform/loop';

const LOCALE = 'en';

export function startShell(app: HTMLElement): void {
  const showTitle = (): void => {
    const title = document.createElement('h1');
    title.textContent = 'Book Order';
    const blurb = document.createElement('p');
    blurb.textContent = 'Pick the Book that comes next.';
    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = 'Play';
    play.addEventListener('click', showPicker);
    app.replaceChildren(title, blurb, play);
  };

  const showPicker = (): void => {
    const title = document.createElement('h1');
    title.textContent = 'Book Order';
    const blurb = document.createElement('p');
    blurb.textContent = 'Choose a Route.';

    const courses = document.createElement('div');
    courses.className = 'routes';
    for (const route of ROUTES) {
      if (route === 'canon') continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = routeLabel(route, LOCALE);
      button.addEventListener('click', () => showRun({ seed: freshSeed(), route }));
      courses.append(button);
    }

    const canon = document.createElement('div');
    canon.className = 'canon';
    const canonLabel = document.createElement('span');
    canonLabel.textContent = routeLabel('canon', LOCALE);
    const start = document.createElement('select');
    start.ariaLabel = 'Canon start point';
    for (const section of SECTION_ORDER) {
      const option = document.createElement('option');
      option.value = section;
      option.textContent = sectionLabel(section, LOCALE);
      start.append(option);
    }
    const begin = document.createElement('button');
    begin.type = 'button';
    begin.textContent = 'Play';
    begin.addEventListener('click', () => {
      const section = start.value as SectionId;
      showRun({ seed: freshSeed(), route: 'canon', start: section });
    });
    canon.append(canonLabel, start, begin);

    app.replaceChildren(title, blurb, courses, canon);
  };

  const showRun = (options: RunOptions): void => {
    const host = document.createElement('section');
    app.replaceChildren(host);

    let state = BOOK_ORDER.createRun(options, LOCALE);
    let pending: Action | null = null;

    startLoop((dtMs) => {
      state = BOOK_ORDER.advance(state, dtMs, pending);
      pending = null;
      BOOK_ORDER.render(state, host, (action) => {
        pending = action;
      });
      if (!BOOK_ORDER.result(state).over) return true;
      showResult(state, options);
      return false;
    });
  };

  const showResult = (state: BookOrderState, options: RunOptions): void => {
    const result = BOOK_ORDER.result(state);
    const title = document.createElement('h1');
    const caption = document.createElement('p');
    const missed = document.createElement('ol');

    if (result.complete) {
      title.textContent = 'Canon complete';
      caption.textContent = 'You reached Revelation. This Run has no score.';
    } else {
      title.textContent = 'Run over';
      caption.textContent =
        result.review.length > 0 ? 'Missed Books, in canon order:' : 'Nothing missed.';
      for (const item of result.review) {
        const entry = document.createElement('li');
        entry.textContent = item.name;
        missed.append(entry);
      }
    }

    const again = document.createElement('button');
    again.type = 'button';
    again.textContent = 'Play again';
    again.addEventListener('click', () => showRun({ ...options, seed: freshSeed() }));
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.textContent = 'Choose a Route';
    choose.addEventListener('click', showPicker);
    app.replaceChildren(title, caption, missed, again, choose);
  };

  showTitle();
}

/** The shell owns randomness; the Mode only ever replays from the seed it is given. */
function freshSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}
