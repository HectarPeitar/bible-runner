// The shell owns the flow, the settings and the loop: which screen is up, where a
// Run's score lands, and when a Route's Start boost is earned or spent. The screens
// are in screens.ts and the Rules are in the Mode.

import type { Locale } from '../content/books';
import { resolveLocale, strings } from '../content/strings';
import { BOOK_ORDER } from '../modes/book-order';
import { boardOf } from '../modes/book-order/routes';
import type { BookOrderState } from '../modes/book-order/state';
import type { Action, RunOptions } from '../modes/types';
import { cleanName, entriesOf, recordScore, type BoardId, type ScoreEntry } from '../platform/board';
import { startLoop } from '../platform/loop';
import { boostReady, loadSettings, saveSettings, setBoost } from '../platform/storage';
import { boardsScreen, pickerScreen, resultScreen, titleScreen } from './screens';

export function startShell(app: HTMLElement): void {
  let settings = loadSettings();
  /** The Locale every screen and Run follows; a Run keeps the one it started in. */
  let locale = resolveLocale(settings.locale, navigator.language);

  /** The page says which Locale it is written in, and names itself in it. */
  const markLocale = (): void => {
    document.documentElement.lang = locale;
    document.title = strings(locale).title;
  };

  /** The chosen Locale outlives the screen that offered it. */
  const remember = (chosen: Locale): void => {
    locale = chosen;
    settings = { ...settings, locale: chosen };
    saveSettings(settings);
  };

  /** The entries a board shows under the Mode's curve; a bumped curve shows none. */
  const entriesFor = (board: BoardId): readonly ScoreEntry[] =>
    entriesOf(settings.boards[board], BOOK_ORDER.curve);

  function showTitle(): void {
    markLocale();
    titleScreen(app, locale, {
      chooseLocale: (chosen) => {
        remember(chosen);
        showTitle();
      },
      play: showPicker,
    });
  }

  function showPicker(): void {
    markLocale();
    pickerScreen(
      app,
      locale,
      (route) => boostReady(settings, route),
      {
        chooseLocale: (chosen) => {
          remember(chosen);
          showPicker();
        },
        startCourse: (route, boost) => startRun({ route, seed: freshSeed() }, boost),
        startCanon: (section, boost) =>
          startRun({ route: 'canon', start: section, seed: freshSeed() }, boost),
        scores: showBoards,
      },
    );
  }

  function showBoards(): void {
    markLocale();
    boardsScreen(app, locale, (route) => entriesFor(boardOf(route)), showPicker);
  }

  /** A Run that accepts the Start boost spends it: spent by playing, never by being offered. */
  function startRun(options: RunOptions, boost: boolean): void {
    if (boost) {
      settings = setBoost(settings, options.route, false);
      saveSettings(settings);
    }
    showRun(options, boost);
  }

  function showRun(options: RunOptions, boost: boolean): void {
    const host = document.createElement('section');
    app.replaceChildren(host);

    let state = BOOK_ORDER.createRun({ ...options, startBoost: boost }, locale);
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
  }

  function showResult(state: BookOrderState, options: RunOptions, recorded = false): void {
    markLocale();
    const result = BOOK_ORDER.result(state);
    if (result.boostEarned && !boostReady(settings, options.route)) {
      settings = setBoost(settings, options.route, true);
      saveSettings(settings);
    }
    resultScreen(app, {
      locale,
      result,
      name: settings.name,
      entries: result.board === null ? [] : entriesFor(result.board),
      recorded,
      onRecord: (name) => record(state, options, name),
      onAgain: () => showRun({ ...options, seed: freshSeed() }, false),
      onChoose: showPicker,
    });
  }

  /**
   * The name is remembered before the Run is recorded, so a friend's turn is one
   * click. A refused write still leaves this Run's entry in hand for the screen.
   */
  function record(state: BookOrderState, options: RunOptions, raw: string): void {
    const { board, score } = BOOK_ORDER.result(state);
    const name = cleanName(raw);
    settings = { ...settings, name };
    if (board !== null) {
      settings = {
        ...settings,
        boards: {
          ...settings.boards,
          [board]: recordScore(settings.boards[board], BOOK_ORDER.curve, {
            name,
            score,
            at: Date.now(),
          }),
        },
      };
    }
    saveSettings(settings);
    showResult(state, options, true);
  }

  showTitle();
}

/** The shell owns randomness; the Mode only ever replays from the seed it is given. */
function freshSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}
