// One key, one object: the chosen Locale, the remembered name, every board, and
// the Start boosts. All access inside try/catch — a browser that refuses storage
// must still play, because persistence is a convenience and never a requirement.

import { LOCALES, type Locale } from '../content/books';
import { cleanName, type Board, type ScoreEntry } from './board';

const KEY = 'bible-runner:v1';

/**
 * One Start boost per Route, marked ready by a clean finish and spent by a Run.
 * Opaque here: the key is whatever the Mode called its Route, so a second Mode
 * stores boosts without the platform learning what a Route is.
 */
export type Boosts = Record<string, true>;

export type Settings = {
  /** The Locale the player chose, or null before they have chosen one. */
  locale: Locale | null;
  /** Remembered for the next player on a shared computer; empty before the first save. */
  name: string;
  /** One entry per board id a Mode reports; absent until a score is recorded on it. */
  boards: Partial<Record<string, Board>>;
  /** The Routes with a Start boost waiting to be offered; absent until one is earned. */
  boosts: Boosts;
};

const NO_SETTINGS: Settings = { locale: null, name: '', boards: {}, boosts: {} };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value);

/** Kept only if it is exactly what this game would have written. */
const isEntry = (value: unknown): value is ScoreEntry => {
  if (!isRecord(value)) return false;
  const { name, score, at } = value;
  return (
    typeof name === 'string' &&
    cleanName(name) === name &&
    typeof score === 'number' &&
    Number.isInteger(score) &&
    score >= 0 &&
    typeof at === 'number' &&
    Number.isFinite(at)
  );
};

/** A board that makes no sense is no board; a corrupt entry inside it just drops out. */
const toBoard = (value: unknown): Board | null => {
  if (!isRecord(value) || !Array.isArray(value.entries)) return null;
  if (typeof value.curve !== 'number' || !Number.isInteger(value.curve)) return null;
  return { curve: value.curve, entries: value.entries.filter(isEntry) };
};

/** A name is worth pre-filling only once a player has saved one. */
const rememberedName = (value: unknown): string =>
  typeof value === 'string' && value.trim() !== '' ? cleanName(value) : '';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    const stored: unknown = raw === null ? null : JSON.parse(raw);
    if (!isRecord(stored)) return NO_SETTINGS;
    const boards: Partial<Record<string, Board>> = {};
    if (isRecord(stored.boards)) {
      for (const [id, value] of Object.entries(stored.boards)) {
        const board = toBoard(value);
        if (board !== null) boards[id] = board;
      }
    }
    const boosts: Boosts = {};
    if (isRecord(stored.boosts)) {
      // Any key is kept, because only the Mode knows which Routes it has; only a
      // stored `true` is a boost, so a key nothing ever asks about is harmless.
      for (const [route, ready] of Object.entries(stored.boosts)) {
        if (ready === true) boosts[route] = true;
      }
    }
    return {
      locale: isLocale(stored.locale) ? stored.locale : null,
      name: rememberedName(stored.name),
      boards,
      boosts,
    };
  } catch {
    return NO_SETTINGS;
  }
}

/** A Start boost is waiting on this Route, until a Run of it accepts the boost. */
export function boostReady(settings: Settings, route: string): boolean {
  return settings.boosts[route] === true;
}

/** Marks a Route's Start boost ready after a clean finish, or spends it when a Run accepts it. */
export function setBoost(settings: Settings, route: string, ready: boolean): Settings {
  const boosts: Boosts = { ...settings.boosts };
  if (ready) boosts[route] = true;
  else delete boosts[route];
  return { ...settings, boosts };
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Refused or absent storage: the game plays on, silently.
  }
}
