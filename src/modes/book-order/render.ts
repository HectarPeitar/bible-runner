import { BOOKS } from '../../content/books';
import { fill, strings } from '../../content/strings';
import type { Action } from '../types';
import { LANES, ROWS_ON_ROAD } from './rules';
import { CANON_FIRST_BOOK, CANON_LAST_BOOK } from './routes';
import type { BookOrderState } from './state';

// The renderer owns the shape of the road; the Rules own the world units and the
// time between Rows. These numbers are the look, proven in spike/runner.html.
const PERSPECTIVE = 4200;
const ROAD_AT_PLAYER = 0.76;
const HORIZON = 0.24;
const PLAYER_Y = 0.86;
const GATE_MAX_WIDTH = 320;
/** Text is read, not drawn to scale: a name smaller than this is met too late. */
const MIN_FONT = 12;

type View = {
  host: HTMLElement;
  stage: HTMLDivElement;
  after: HTMLParagraphElement;
  hud: HTMLParagraphElement;
  runner: HTMLDivElement;
  /** One element per Lane of every Row on the road, filled from the front. */
  gates: HTMLDivElement[];
  offer: HTMLDivElement;
  prompt: HTMLParagraphElement;
  finish: HTMLButtonElement;
  wrap: HTMLButtonElement;
  dispatch: (action: Action) => void;
  /** Whether the Run on screen still takes steering. */
  accepting: boolean;
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

  view.dispatch = dispatch;
  // Keys steer the Run that is on screen, and nothing once it is over or asking.
  view.accepting = !state.over && state.offer === null;
  onScreen = view;

  view.after.textContent = fill(copy.after, { book: name(state.position) });
  const speed = `${state.speed.toFixed(1)}×`;
  view.hud.textContent = `${fill(copy.score, { score: String(state.score) })} · ${fill(copy.status, { speed })}`;

  project(view, state, name);

  const offering = state.offer !== null;
  view.offer.hidden = !offering;
  if (offering) {
    view.prompt.textContent = fill(copy.reachedLast, {
      book: name(CANON_LAST_BOOK),
      first: name(CANON_FIRST_BOOK),
    });
    view.finish.textContent = fill(copy.finishAt, { book: name(CANON_LAST_BOOK) });
    view.wrap.textContent = fill(copy.wrapInto, { book: name(CANON_FIRST_BOOK) });
  }
}

/** Nearer is lower and larger; each Row's Gates sit on its own line of the road. */
function project(view: View, state: BookOrderState, name: (order: number) => string): void {
  const width = view.stage.clientWidth;
  const height = view.stage.clientHeight;

  state.rows.forEach((row, at) => {
    const scale = PERSPECTIVE / (PERSPECTIVE + Math.max(0, row.z));
    const y = height * (HORIZON + (PLAYER_Y - HORIZON) * scale);
    const laneWidth = (width * ROAD_AT_PLAYER * scale) / LANES;
    const boxWidth = Math.min(GATE_MAX_WIDTH, laneWidth * 0.94);
    const boxHeight = 30 + 32 * scale;

    row.gates.forEach((order, lane) => {
      const gate = view.gates[at * LANES + lane];
      const label = name(order);
      // The marking is the teaching: the stumbled Row's answer is the one Gate lit,
      // and its distractors recede so "this one" reads at a glance, not by shade.
      const marked = state.stumbled && at === 0 && order === row.answer;
      gate.classList.toggle('marked', marked);
      gate.classList.toggle('dimmed', state.stumbled && at === 0 && !marked);
      if (gate.textContent !== label) gate.textContent = label;
      gate.hidden = false;
      gate.style.width = `${boxWidth}px`;
      gate.style.height = `${boxHeight}px`;
      // Sized for reading, not for perspective: a long name shrinks to its box,
      // but never below MIN_FONT, where a Row this far off is unreadable anyway.
      const fit = boxWidth / Math.max(4, label.length * 0.56);
      gate.style.fontSize = `${Math.max(MIN_FONT, Math.min(MIN_FONT + 8 * scale, fit))}px`;
      const x = width / 2 + (lane - (LANES - 1) / 2) * laneWidth;
      gate.style.transform = `translate3d(${x - boxWidth / 2}px, ${y - boxHeight / 2}px, 0)`;
      gate.style.zIndex = String(100 - at);
    });
  });

  for (let at = state.rows.length * LANES; at < view.gates.length; at += 1) {
    view.gates[at].hidden = true;
  }

  const laneWidth = (width * ROAD_AT_PLAYER) / LANES;
  view.runner.style.left = `${width / 2 + (state.lane - (LANES - 1) / 2) * laneWidth}px`;
  view.runner.style.top = `${height * PLAYER_Y}px`;
}

function createView(host: HTMLElement, dispatch: (action: Action) => void): View {
  const stage = document.createElement('div');
  stage.className = 'stage';

  const road = document.createElement('div');
  road.className = 'road';
  const horizon = document.createElement('div');
  horizon.className = 'horizon';

  const after = document.createElement('p');
  after.className = 'after';
  const hud = document.createElement('p');
  hud.className = 'hud';

  const runner = document.createElement('div');
  runner.className = 'runner';
  runner.textContent = '▲';

  const gates = Array.from({ length: ROWS_ON_ROAD * LANES }, () => {
    const gate = document.createElement('div');
    gate.className = 'gate';
    gate.hidden = true;
    return gate;
  });

  stage.append(road, horizon, ...gates, runner, after, hud);

  const offer = document.createElement('div');
  offer.className = 'offer';
  offer.hidden = true;
  const prompt = document.createElement('p');
  const finish = document.createElement('button');
  finish.type = 'button';
  const wrap = document.createElement('button');
  wrap.type = 'button';
  offer.append(prompt, finish, wrap);

  host.className = 'run';
  host.replaceChildren(stage, offer);

  const view: View = {
    host,
    stage,
    after,
    hud,
    runner,
    gates,
    offer,
    prompt,
    finish,
    wrap,
    dispatch,
    accepting: false,
  };
  views.set(host, view);

  // The offer is the one thing left to click in a Run.
  finish.addEventListener('click', () => view.dispatch({ type: 'finish' }));
  wrap.addEventListener('click', () => view.dispatch({ type: 'wrap' }));
  listenForSteering();

  return view;
}

/** The page's one keydown listener: it steers whichever Run is on screen. */
/** The Run on screen, so the page's one keydown listener steers the right one. */
let onScreen: View | null = null;
let listening = false;

function listenForSteering(): void {
  if (listening) return;
  listening = true;

  window.addEventListener('keydown', (event) => {
    const view = onScreen;
    if (view === null || !view.host.isConnected || !view.accepting) return;
    // One Lane per press: a held key is one press, not a slide across the road.
    if (event.repeat) return;

    const action: Action | null =
      event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A'
        ? { type: 'left' }
        : event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D'
          ? { type: 'right' }
          : null;
    if (action === null) return;

    event.preventDefault();
    view.dispatch(action);
  });
}
