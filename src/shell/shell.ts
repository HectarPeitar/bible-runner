import { BOOK_ORDER } from '../modes/book-order';
import type { BookOrderState } from '../modes/book-order/state';
import type { Action } from '../modes/types';
import { startLoop } from '../platform/loop';

export function startShell(app: HTMLElement): void {
  const showTitle = (): void => {
    const title = document.createElement('h1');
    title.textContent = 'Book Order';
    const blurb = document.createElement('p');
    blurb.textContent = 'Pick the Book that comes next in the Gospels.';
    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = 'Play';
    play.addEventListener('click', showRun);
    app.replaceChildren(title, blurb, play);
  };

  const showRun = (): void => {
    const host = document.createElement('section');
    app.replaceChildren(host);

    let state = BOOK_ORDER.createRun({ seed: freshSeed(), section: 'gospels' }, 'en');
    let pending: Action | null = null;

    startLoop((dtMs) => {
      state = BOOK_ORDER.advance(state, dtMs, pending);
      pending = null;
      BOOK_ORDER.render(state, host, (action) => {
        pending = action;
      });
      if (!BOOK_ORDER.result(state).over) return true;
      showResult(state);
      return false;
    });
  };

  const showResult = (state: BookOrderState): void => {
    const result = BOOK_ORDER.result(state);
    const title = document.createElement('h1');
    title.textContent = 'Run over';
    const caption = document.createElement('p');
    caption.textContent =
      result.review.length > 0 ? 'Missed Books, in canon order:' : 'Nothing missed.';
    const missed = document.createElement('ol');
    for (const item of result.review) {
      const entry = document.createElement('li');
      entry.textContent = item.name;
      missed.append(entry);
    }
    const again = document.createElement('button');
    again.type = 'button';
    again.textContent = 'Play again';
    again.addEventListener('click', showRun);
    app.replaceChildren(title, caption, missed, again);
  };

  showTitle();
}

/** The shell owns randomness; the Mode only ever replays from the seed it is given. */
function freshSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}
