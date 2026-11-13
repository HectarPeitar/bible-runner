// One key, one object: the chosen Locale, the remembered name, and every board.
// All access inside try/catch — a browser that refuses storage must still play,
// because persistence is a convenience and never a requirement.

import { LOCALES, type Locale } from '../content/books';

const KEY = 'bible-runner:v1';

export type Settings = {
  /** The Locale the player chose, or null before they have chosen one. */
  locale: Locale | null;
  /** Remembered for the next player on a shared computer; filled by ticket 14. */
  name: string;
  /** One entry per Route, keyed by board id; filled by ticket 14. */
  boards: Record<string, unknown>;
};

const NO_SETTINGS: Settings = { locale: null, name: '', boards: {} };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value);

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    const stored: unknown = raw === null ? null : JSON.parse(raw);
    if (!isRecord(stored)) return NO_SETTINGS;
    return {
      locale: isLocale(stored.locale) ? stored.locale : null,
      name: typeof stored.name === 'string' ? stored.name : '',
      boards: isRecord(stored.boards) ? stored.boards : {},
    };
  } catch {
    return NO_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Refused or absent storage: the game plays on, silently.
  }
}
