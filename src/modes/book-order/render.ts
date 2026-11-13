import { BOOKS } from '../../content/books';
import { fill, strings } from '../../content/strings';
import type { Action } from '../types';
import { CANON_FIRST_BOOK, CANON_LAST_BOOK } from './routes';
import { LANES, rowTravelMs } from './rules';
import type { BookOrderState } from './state';

type View = {
  after: HTMLParagraphElement;
  status: HTMLParagraphElement;
  row: HTMLDivElement;
  gates: HTMLButtonElement[];
  offer: HTMLDivElement;
  prompt: HTMLParagraphElement;
  finish: HTMLButtonElement;
  wrap: HTMLButtonElement;
};

const views = new WeakMap<HTMLElement, View>();

export function render(
  state: BookOrderState,
  host: HTMLElement,
  dispatch: (action: Action) => void,
): void {
  const view = views.get(host) ?? createView(host, dispatch);
  const copy = strings(state.locale);
  const name = (order: number): string => BOOKS[order - 1].names[state.locale];

  view.after.textContent = fill(copy.after, { book: name(state.position) });
  view.status.textContent = fill(copy.status, {
    lives: String(state.lives),
    speed: state.speed.toFixed(1),
  });

  const progress = Math.min(1, state.beatMs / rowTravelMs(state.speed));
  view.row.style.transform = `translateY(${Math.round((progress - 1) * 8)}rem)`;

  state.gates.forEach((order, lane) => {
    const gate = view.gates[lane];
    gate.textContent = name(order);
    gate.className = state.marked && order === state.answer ? 'gate marked' : 'gate';
  });

  const offering = state.offer !== null;
  view.offer.hidden = !offering;
  view.row.hidden = offering;
  if (offering) {
    view.prompt.textContent = fill(copy.reachedLast, {
      book: name(CANON_LAST_BOOK),
      first: name(CANON_FIRST_BOOK),
    });
    view.finish.textContent = fill(copy.finishAt, { book: name(CANON_LAST_BOOK) });
    view.wrap.textContent = fill(copy.wrapInto, { book: name(CANON_FIRST_BOOK) });
  }
}

function createView(host: HTMLElement, dispatch: (action: Action) => void): View {
  const after = document.createElement('p');
  after.className = 'after';

  const status = document.createElement('p');
  status.className = 'status';

  const row = document.createElement('div');
  row.className = 'row';
  const gates = Array.from({ length: LANES }, (_unused, lane) => {
    const gate = document.createElement('button');
    gate.type = 'button';
    gate.className = 'gate';
    gate.addEventListener('click', () => dispatch({ type: 'pick', lane }));
    return gate;
  });
  row.append(...gates);

  const offer = document.createElement('div');
  offer.className = 'offer';
  const prompt = document.createElement('p');
  const finish = document.createElement('button');
  finish.type = 'button';
  finish.addEventListener('click', () => dispatch({ type: 'finish' }));
  const wrap = document.createElement('button');
  wrap.type = 'button';
  wrap.addEventListener('click', () => dispatch({ type: 'wrap' }));
  offer.append(prompt, finish, wrap);

  host.replaceChildren(after, status, row, offer);
  const view = { after, status, row, gates, offer, prompt, finish, wrap };
  views.set(host, view);
  return view;
}
