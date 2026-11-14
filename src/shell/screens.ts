// The screens, as plain DOM: each writes into the host it is given and its buttons
// call back into the shell, so no screen knows a stored setting, a score or a loop.

import { SECTION_ORDER, type Locale, type SectionId } from '../content/books';
import { LOCALES_OFFERED, fill, strings, type Strings } from '../content/strings';
import {
  ROUTES,
  routeLabel,
  sectionLabel,
  type CourseId,
  type RouteId,
} from '../modes/book-order/routes';
import type { RunResult } from '../modes/types';
import { SHOWN, qualifies, type ScoreEntry } from '../platform/board';

export type TitleActions = {
  chooseLocale(locale: Locale): void;
  play(): void;
};

export function titleScreen(host: HTMLElement, locale: Locale, actions: TitleActions): void {
  const copy = strings(locale);
  const title = document.createElement('h1');
  title.textContent = copy.title;
  const tagline = document.createElement('p');
  tagline.textContent = copy.tagline;
  const play = document.createElement('button');
  play.type = 'button';
  play.textContent = copy.play;
  play.addEventListener('click', actions.play);
  host.replaceChildren(
    title,
    tagline,
    localePicker(locale, actions.chooseLocale),
    play,
    disclaimer(locale),
  );
}

export type PickerActions = {
  chooseLocale(locale: Locale): void;
  /** Start a Course Run; `boost` accepts that Route's waiting Start boost. */
  startCourse(route: CourseId, boost: boolean): void;
  /** Start a canon Run at a Section; `boost` accepts the canon Route's Start boost. */
  startCanon(section: SectionId, boost: boolean): void;
  scores(): void;
};

export function pickerScreen(
  host: HTMLElement,
  locale: Locale,
  boostWaiting: (route: RouteId) => boolean,
  actions: PickerActions,
): void {
  const copy = strings(locale);
  const title = document.createElement('h1');
  title.textContent = copy.title;
  const blurb = document.createElement('p');
  blurb.textContent = copy.routePrompt;

  const courses = document.createElement('div');
  courses.className = 'routes';
  for (const route of ROUTES) {
    if (route === 'canon') continue;
    const row = document.createElement('div');
    row.className = 'route';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = routeLabel(route, locale);
    button.addEventListener('click', () => actions.startCourse(route, false));
    row.append(button);
    const boost = boostButton(copy, boostWaiting(route), () => actions.startCourse(route, true));
    if (boost !== null) row.append(boost);
    courses.append(row);
  }

  const canon = document.createElement('div');
  canon.className = 'canon';
  const canonLabel = document.createElement('span');
  canonLabel.textContent = routeLabel('canon', locale);
  const startSection = document.createElement('select');
  startSection.ariaLabel = copy.canonStart;
  for (const section of SECTION_ORDER) {
    const option = document.createElement('option');
    option.value = section;
    option.textContent = sectionLabel(section, locale);
    startSection.append(option);
  }
  const chosen = (): SectionId => startSection.value as SectionId;
  const begin = document.createElement('button');
  begin.type = 'button';
  begin.textContent = copy.play;
  begin.addEventListener('click', () => actions.startCanon(chosen(), false));
  canon.append(canonLabel, startSection, begin);
  const canonBoost = boostButton(copy, boostWaiting('canon'), () =>
    actions.startCanon(chosen(), true),
  );
  if (canonBoost !== null) canon.append(canonBoost);

  const scores = document.createElement('button');
  scores.type = 'button';
  scores.textContent = copy.scores;
  scores.addEventListener('click', actions.scores);

  host.replaceChildren(title, blurb, localePicker(locale, actions.chooseLocale), courses, canon, scores);
}

export function boardsScreen(
  host: HTMLElement,
  locale: Locale,
  entriesOf: (route: RouteId) => readonly ScoreEntry[],
  back: () => void,
): void {
  const copy = strings(locale);
  const title = document.createElement('h1');
  title.textContent = copy.scores;

  const sections = ROUTES.map((route) => {
    const heading = document.createElement('h2');
    heading.textContent = routeLabel(route, locale);
    const section = document.createElement('section');
    section.append(heading, scoreList(locale, entriesOf(route)));
    return section;
  });

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.textContent = copy.back;
  backButton.addEventListener('click', back);

  host.replaceChildren(title, ...sections, backButton, disclaimer(locale));
}

export type ResultView = {
  locale: Locale;
  result: RunResult;
  /** The remembered name, pre-filled into the prompt. */
  name: string;
  /** The board's entries under the Mode's current speed curve. */
  entries: readonly ScoreEntry[];
  /** This Run is already on the board, so a second name prompt is not offered. */
  recorded: boolean;
  onRecord(name: string): void;
  onAgain(): void;
  onChoose(): void;
};

export function resultScreen(host: HTMLElement, view: ResultView): void {
  const copy = strings(view.locale);
  const result = view.result;
  const title = document.createElement('h1');
  const caption = document.createElement('p');
  const missed = document.createElement('ol');
  const screen: HTMLElement[] = [title, caption];

  if (result.complete) {
    title.textContent = copy.canonComplete;
    caption.textContent = copy.canonCompleteCaption;
  } else {
    title.textContent = copy.runOver;
  }

  // The Review is the one thing a Run leaves that teaches, so it survives a Run
  // that reached Revelation as well as one that was Caught.
  if (result.review.length > 0) {
    if (!result.complete) caption.textContent = copy.missedBooks;
    else {
      const label = document.createElement('p');
      label.textContent = copy.missedBooks;
      screen.push(label);
    }
    for (const item of result.review) {
      const entry = document.createElement('li');
      entry.textContent = item.name;
      missed.append(entry);
    }
    screen.push(missed);
  } else if (!result.complete) {
    caption.textContent = copy.nothingMissed;
  }

  if (result.board !== null) {
    const score = document.createElement('p');
    score.className = 'score';
    score.textContent = fill(copy.score, { score: String(result.score) });
    screen.push(score, scoreList(view.locale, view.entries.slice(0, SHOWN)));
    if (!view.recorded && qualifies(view.entries, result.score)) {
      screen.push(nameForm(copy, view.name, view.onRecord));
    }
  }

  if (result.boostEarned) {
    const note = document.createElement('p');
    note.className = 'boost';
    note.textContent = copy.startBoostEarned;
    screen.push(note);
  }

  const again = document.createElement('button');
  again.type = 'button';
  again.textContent = copy.playAgain;
  again.addEventListener('click', view.onAgain);
  const choose = document.createElement('button');
  choose.type = 'button';
  choose.textContent = copy.chooseRoute;
  choose.addEventListener('click', view.onChoose);
  host.replaceChildren(...screen, again, choose);
}

/** A Locale names itself, so the picker needs no language names to translate. */
function endonym(locale: Locale): string {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale;
}

function localePicker(locale: Locale, choose: (locale: Locale) => void): HTMLElement {
  const label = document.createElement('label');
  label.textContent = strings(locale).language;
  const select = document.createElement('select');
  for (const offered of LOCALES_OFFERED) {
    const option = document.createElement('option');
    option.value = offered;
    option.textContent = endonym(offered);
    option.selected = offered === locale;
    select.append(option);
  }
  select.addEventListener('change', () => choose(select.value as Locale));
  label.append(select);
  return label;
}

/** The game says whose project it is not, wherever it names itself. */
function disclaimer(locale: Locale): HTMLElement {
  const note = document.createElement('p');
  note.className = 'disclaimer';
  note.textContent = strings(locale).disclaimer;
  return note;
}

/** A waiting Start boost sits beside the normal start, so it can be declined. */
function boostButton(copy: Strings, waiting: boolean, accept: () => void): HTMLButtonElement | null {
  if (!waiting) return null;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'boost';
  button.textContent = copy.startBoostPlay;
  button.addEventListener('click', accept);
  return button;
}

function scoreList(locale: Locale, entries: readonly ScoreEntry[]): HTMLElement {
  const copy = strings(locale);
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = copy.boardEmpty;
    return empty;
  }
  const list = document.createElement('ol');
  for (const entry of entries) {
    const item = document.createElement('li');
    item.textContent = fill(copy.boardEntry, {
      name: entry.name,
      score: String(entry.score),
    });
    list.append(item);
  }
  return list;
}

function nameForm(copy: Strings, name: string, record: (name: string) => void): HTMLFormElement {
  const form = document.createElement('form');
  const prompt = document.createElement('p');
  prompt.textContent = copy.namePrompt;
  const label = document.createElement('label');
  label.textContent = copy.nameLabel;
  const input = document.createElement('input');
  input.name = 'name';
  input.value = name;
  input.ariaLabel = copy.nameLabel;
  label.append(input);
  const save = document.createElement('button');
  save.type = 'submit';
  save.textContent = copy.saveScore;
  const note = document.createElement('p');
  note.className = 'local';
  note.textContent = copy.staysOnDevice;
  form.append(prompt, label, save, note);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    record(input.value);
  });
  return form;
}
