import { SECTION_ORDER, type Locale, type SectionId } from '../content/books';
import { LOCALES_OFFERED, fill, resolveLocale, strings } from '../content/strings';
import { BOOK_ORDER } from '../modes/book-order';
import { SPEED_CURVE } from '../modes/book-order/rules';
import { ROUTES, boardOf, routeLabel, sectionLabel, type RouteId } from '../modes/book-order/routes';
import type { BookOrderState } from '../modes/book-order/state';
import type { Action, RunOptions } from '../modes/types';
import {
  SHOWN,
  cleanName,
  entriesOf,
  qualifies,
  recordScore,
  type BoardId,
  type ScoreEntry,
} from '../platform/board';
import { startLoop } from '../platform/loop';
import { loadSettings, boostReady, saveSettings, setBoost } from '../platform/storage';

export function startShell(app: HTMLElement): void {
  let settings = loadSettings();
  const firstLocale = resolveLocale(settings.locale, navigator.language);

  /** The page says which Locale it is written in, and names itself in it. */
  const markLocale = (locale: Locale): void => {
    document.documentElement.lang = locale;
    document.title = strings(locale).title;
  };

  const localePicker = (locale: Locale, show: (locale: Locale) => void): HTMLElement => {
    const copy = strings(locale);
    const label = document.createElement('label');
    label.textContent = copy.language;
    const select = document.createElement('select');
    for (const offered of LOCALES_OFFERED) {
      const option = document.createElement('option');
      option.value = offered;
      option.textContent = endonym(offered);
      option.selected = offered === locale;
      select.append(option);
    }
    select.addEventListener('change', () => {
      const chosen = select.value as Locale;
      settings = { ...settings, locale: chosen };
      saveSettings(settings);
      show(chosen);
    });
    label.append(select);
    return label;
  };

  const showTitle = (locale: Locale): void => {
    markLocale(locale);
    const copy = strings(locale);
    const title = document.createElement('h1');
    title.textContent = copy.title;
    const tagline = document.createElement('p');
    tagline.textContent = copy.tagline;
    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = copy.play;
    play.addEventListener('click', () => showPicker(locale));
    app.replaceChildren(title, tagline, localePicker(locale, showTitle), play);
  };

  /** The entries a board shows under today's speed curve; a bumped curve shows none. */
  const boardEntries = (board: BoardId): readonly ScoreEntry[] =>
    entriesOf(settings.boards[board], SPEED_CURVE);

  /**
   * A Route whose last clean Run earned a Start boost offers it beside the normal
   * start, so the offer is visible before the Run and can be declined.
   */
  const boostChoice = (
    route: RouteId,
    locale: Locale,
    options: () => RunOptions,
  ): HTMLButtonElement | null => {
    if (!boostReady(settings, route)) return null;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'boost';
    button.textContent = strings(locale).startBoostPlay;
    button.addEventListener('click', () => {
      // Spent by the Run that accepts it, never by being offered, and never twice.
      settings = setBoost(settings, route, false);
      saveSettings(settings);
      showRun(options(), locale, true);
    });
    return button;
  };

  const scoreList = (entries: readonly ScoreEntry[], locale: Locale): HTMLElement => {
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
  };

  const showPicker = (locale: Locale): void => {
    markLocale(locale);
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
      button.addEventListener('click', () => showRun({ seed: freshSeed(), route }, locale));
      row.append(button);
      const boost = boostChoice(route, locale, () => ({ seed: freshSeed(), route }));
      if (boost !== null) row.append(boost);
      courses.append(row);
    }

    const canon = document.createElement('div');
    canon.className = 'canon';
    const canonLabel = document.createElement('span');
    canonLabel.textContent = routeLabel('canon', locale);
    const start = document.createElement('select');
    start.ariaLabel = copy.canonStart;
    for (const section of SECTION_ORDER) {
      const option = document.createElement('option');
      option.value = section;
      option.textContent = sectionLabel(section, locale);
      start.append(option);
    }
    const begin = document.createElement('button');
    begin.type = 'button';
    begin.textContent = copy.play;
    begin.addEventListener('click', () => {
      const section = start.value as SectionId;
      showRun({ seed: freshSeed(), route: 'canon', start: section }, locale);
    });
    canon.append(canonLabel, start, begin);
    const canonBoost = boostChoice('canon', locale, () => ({
      seed: freshSeed(),
      route: 'canon',
      start: start.value as SectionId,
    }));
    if (canonBoost !== null) canon.append(canonBoost);

    const scores = document.createElement('button');
    scores.type = 'button';
    scores.textContent = copy.scores;
    scores.addEventListener('click', () => showBoards(locale));

    app.replaceChildren(title, blurb, localePicker(locale, showPicker), courses, canon, scores);
  };

  const showBoards = (locale: Locale): void => {
    markLocale(locale);
    const copy = strings(locale);
    const title = document.createElement('h1');
    title.textContent = copy.scores;

    const sections = ROUTES.map((route) => {
      const heading = document.createElement('h2');
      heading.textContent = routeLabel(route, locale);
      const section = document.createElement('section');
      section.append(heading, scoreList(boardEntries(boardOf(route)), locale));
      return section;
    });

    const back = document.createElement('button');
    back.type = 'button';
    back.textContent = copy.back;
    back.addEventListener('click', () => showPicker(locale));

    app.replaceChildren(title, ...sections, back);
  };

  /**
   * The name is remembered before the Run is recorded, so a friend's turn is one
   * click. A refused write still leaves this Run's entry in hand for the screen.
   */
  const record = (
    state: BookOrderState,
    options: RunOptions,
    locale: Locale,
    board: BoardId,
    score: number,
    raw: string,
  ): void => {
    const name = cleanName(raw);
    settings = {
      ...settings,
      name,
      boards: {
        ...settings.boards,
        [board]: recordScore(settings.boards[board], SPEED_CURVE, {
          name,
          score,
          at: Date.now(),
        }),
      },
    };
    saveSettings(settings);
    showResult(state, options, locale, true);
  };

  const nameForm = (
    state: BookOrderState,
    options: RunOptions,
    locale: Locale,
    board: BoardId,
    score: number,
  ): HTMLFormElement => {
    const copy = strings(locale);
    const form = document.createElement('form');
    const prompt = document.createElement('p');
    prompt.textContent = copy.namePrompt;
    const label = document.createElement('label');
    label.textContent = copy.nameLabel;
    const input = document.createElement('input');
    input.name = 'name';
    input.value = settings.name;
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
      record(state, options, locale, board, score, input.value);
    });
    return form;
  };

  const showRun = (options: RunOptions, locale: Locale, startBoost = false): void => {
    const host = document.createElement('section');
    app.replaceChildren(host);

    let state = BOOK_ORDER.createRun({ ...options, startBoost }, locale);
    let pending: Action | null = null;

    startLoop((dtMs) => {
      state = BOOK_ORDER.advance(state, dtMs, pending);
      pending = null;
      BOOK_ORDER.render(state, host, (action) => {
        pending = action;
      });
      if (!BOOK_ORDER.result(state).over) return true;
      showResult(state, options, locale);
      return false;
    });
  };

  const showResult = (
    state: BookOrderState,
    options: RunOptions,
    locale: Locale,
    recorded = false,
  ): void => {
    markLocale(locale);
    const copy = strings(locale);
    const result = BOOK_ORDER.result(state);
    if (result.boostEarned && !boostReady(settings, options.route)) {
      settings = setBoost(settings, options.route, true);
      saveSettings(settings);
    }
    const title = document.createElement('h1');
    const caption = document.createElement('p');
    const missed = document.createElement('ol');
    const screen: HTMLElement[] = [title, caption, missed];

    if (result.complete) {
      title.textContent = copy.canonComplete;
      caption.textContent = copy.canonCompleteCaption;
    } else {
      title.textContent = copy.runOver;
      caption.textContent = result.review.length > 0 ? copy.missedBooks : copy.nothingMissed;
      for (const item of result.review) {
        const entry = document.createElement('li');
        entry.textContent = item.name;
        missed.append(entry);
      }
    }

    if (result.board !== null) {
      const board = result.board;
      const score = document.createElement('p');
      score.className = 'score';
      score.textContent = fill(copy.score, { score: String(result.score) });
      screen.push(score, scoreList(boardEntries(board).slice(0, SHOWN), locale));
      if (!recorded && qualifies(boardEntries(board), result.score)) {
        screen.push(nameForm(state, options, locale, board, result.score));
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
    again.addEventListener('click', () => showRun({ ...options, seed: freshSeed() }, locale));
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.textContent = copy.chooseRoute;
    choose.addEventListener('click', () => showPicker(locale));
    app.replaceChildren(...screen, again, choose);
  };

  showTitle(firstLocale);
}

/** A Locale names itself, so the picker needs no language names to translate. */
function endonym(locale: Locale): string {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale;
}

/** The shell owns randomness; the Mode only ever replays from the seed it is given. */
function freshSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}
