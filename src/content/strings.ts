// The interface chrome, one table per Locale. A Locale ships only when its table
// is complete, so a screen never borrows another Locale's words: there is no
// fallback branch to write, and none to get wrong.

import { LOCALES, type Locale } from './books';
import data from './strings.json';

/** The keys English defines: one list, kept by the Locale the game is written in. */
export type StringKey = keyof (typeof data)['en'];
export type Strings = Record<StringKey, string>;

const TABLES: Record<string, unknown> = data;
const KEYS: readonly string[] = Object.keys(data.en);

const isFilled = (value: unknown): value is string =>
  typeof value === 'string' && value !== '' && value === value.trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Complete: every key English has, filled, and no key English does not have. */
function isCompleteTable(table: unknown): table is Strings {
  if (!isRecord(table)) return false;
  return Object.keys(table).length === KEYS.length && KEYS.every((key) => isFilled(table[key]));
}

/** Every Locale whose table is complete: the only Locales a player is ever offered. */
export function offeredLocales(tables: Record<string, unknown>): Locale[] {
  return LOCALES.filter((locale) => isCompleteTable(tables[locale]));
}

export const LOCALES_OFFERED: readonly Locale[] = offeredLocales(TABLES);

/** The strings of an offered Locale. A Locale with no complete table is not offered. */
export function strings(locale: Locale): Strings {
  const table = TABLES[locale];
  if (!isCompleteTable(table)) {
    throw new Error(`Locale "${locale}" has no complete string table`);
  }
  return table;
}

/** Puts words where a string's placeholders are: `{book}`, `{speed}`. */
export function fill(template: string, words: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_placeholder, key: string) => words[key] ?? `{${key}}`);
}

/**
 * The Locale a Run is played in: the remembered one when it is still offered, else
 * the browser's when its table is complete, else English.
 */
export function resolveLocale(
  remembered: Locale | null,
  browser: string,
  offered: readonly Locale[] = LOCALES_OFFERED,
): Locale {
  if (remembered !== null && offered.includes(remembered)) return remembered;
  const language = browser.toLowerCase().split('-')[0];
  return offered.find((locale) => locale === language) ?? 'en';
}
