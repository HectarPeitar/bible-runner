import { BOOKS } from '../../content/books';
import type { Action } from '../types';
import { previousInSection, type BookOrderState } from './state';
import { rowTravelMs } from './rules';

type View = {
  after: HTMLParagraphElement;
  lives: HTMLSpanElement;
  speed: HTMLSpanElement;
  row: HTMLDivElement;
  gates: HTMLButtonElement[];
};

const views = new WeakMap<HTMLElement, View>();

export function render(
  state: BookOrderState,
  host: HTMLElement,
  dispatch: (action: Action) => void,
): void {
  const view = views.get(host) ?? createView(host, dispatch);
  const name = (order: number): string => BOOKS[order - 1].names[state.locale];

  view.after.textContent = `After ${name(previousInSection(state.section, state.answer))}`;
  view.lives.textContent = String(state.lives);
  view.speed.textContent = state.speed.toFixed(1);

  const progress = Math.min(1, state.beatMs / rowTravelMs(state.speed));
  view.row.style.transform = `translateY(${Math.round((progress - 1) * 8)}rem)`;

  state.gates.forEach((order, lane) => {
    const gate = view.gates[lane];
    gate.textContent = name(order);
    gate.className = state.marked && order === state.answer ? 'gate marked' : 'gate';
  });
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

  host.replaceChildren(after, status, row);
  const view = { after, lives, speed, row, gates };
  views.set(host, view);
  return view;
}
