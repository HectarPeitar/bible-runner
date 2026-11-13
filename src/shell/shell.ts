import { SECTION_ORDER, type Locale, type SectionId } from '../content/books';
import { LOCALES_OFFERED, resolveLocale, strings } from '../content/strings';
import { BOOK_ORDER } from '../modes/book-order';
import { ROUTES, routeLabel, sectionLabel } from '../modes/book-order/routes';
import type { BookOrderState } from '../modes/book-order/state';
import type { Action, RunOptions } from '../modes/types';
import { startLoop } from '../platform/loop';
import { loadSettings, saveSettings } from '../platform/storage';

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
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = routeLabel(route, locale);
      button.addEventListener('click', () => showRun({ seed: freshSeed(), route }, locale));
      courses.append(button);
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

    app.replaceChildren(title, blurb, localePicker(locale, showPicker), courses, canon);
  };

  const showRun = (options: RunOptions, locale: Locale): void => {
    const host = document.createElement('section');
    app.replaceChildren(host);

    let state = BOOK_ORDER.createRun(options, locale);
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

  const showResult = (state: BookOrderState, options: RunOptions, locale: Locale): void => {
    const copy = strings(locale);
    const result = BOOK_ORDER.result(state);
    const title = document.createElement('h1');
    const caption = document.createElement('p');
    const missed = document.createElement('ol');

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

    const again = document.createElement('button');
    again.type = 'button';
    again.textContent = copy.playAgain;
    again.addEventListener('click', () => showRun({ ...options, seed: freshSeed() }, locale));
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.textContent = copy.chooseRoute;
    choose.addEventListener('click', () => showPicker(locale));
    app.replaceChildren(title, caption, missed, again, choose);
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
