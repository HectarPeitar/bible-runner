// One key, one object: the chosen Locale, the remembered name, and every board.
// All access inside try/catch — a browser that refuses storage must still play,
// because persistence is a convenience and never a requirement.

import { LOCALES, type Locale } from '../content/books';
import { BOARD_IDS, cleanName, type Board, type BoardId, type ScoreEntry } from './board';

const KEY = 'bible-runner:v1';

export type Settings = {
  /** The Locale the player chose, or null before they have chosen one. */
  locale: Locale | null;
  /** Remembered for the next player on a shared computer; empty before the first save. */
  name: string;
  /** One entry per Route, keyed by board id; absent until a score is recorded on it. */
  boards: Partial<Record<BoardId, Board>>;
};

const NO_SETTINGS: Settings = { locale: null, name: '', boards: {} };

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
    const boards: Partial<Record<BoardId, Board>> = {};
    if (isRecord(stored.boards)) {
      for (const id of BOARD_IDS) {
        const board = toBoard(stored.boards[id]);
        if (board !== null) boards[id] = board;
      }
    }
    return {
      locale: isLocale(stored.locale) ? stored.locale : null,
      name: rememberedName(stored.name),
      boards,
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
