import { BOOKS } from '../../content/books';
import type { Action } from '../types';
import { CANON_FIRST_BOOK, CANON_LAST_BOOK } from './routes';
import { rowTravelMs } from './rules';
import type { BookOrderState } from './state';

type View = {
  after: HTMLParagraphElement;
  lives: HTMLSpanElement;
  speed: HTMLSpanElement;
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
  const name = (order: number): string => BOOKS[order - 1].names[state.locale];

  view.after.textContent = `After ${name(state.position)}`;
  view.lives.textContent = String(state.lives);
  view.speed.textContent = state.speed.toFixed(1);

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
    view.prompt.textContent = `You reached ${name(CANON_LAST_BOOK)}. Finish, or wrap into ${name(CANON_FIRST_BOOK)}?`;
    view.finish.textContent = `Finish at ${name(CANON_LAST_BOOK)}`;
    view.wrap.textContent = `Wrap into ${name(CANON_FIRST_BOOK)}`;
  }
}

function createView(host: HTMLElement, dispatch: (action: Action) => void): View {
  const after = document.createElement('p');
  after.className = 'after';

  const status = document.createElement('p');
  status.className = 'status';
  const lives = document.createElement('span');
  lives.className = 'lives';
  const speed = document.createElement('span');
  speed.className = 'speed';
  status.append('Lives ', lives, ' · Speed ', speed);

  const row = document.createElement('div');
  row.className = 'row';
  const gates = Array.from({ length: 3 }, (_unused, lane) => {
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
  const view = { after, lives, speed, row, gates, offer, prompt, finish, wrap };
  views.set(host, view);
  return view;
}
