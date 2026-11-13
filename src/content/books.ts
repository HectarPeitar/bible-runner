// Types over the content table. The data lives in books.json so it can be
// checked by scripts/check-content.mjs with no toolchain; the invariants live
// there, not here, so there is exactly one validator.

import data from './books.json';

export type Locale = 'en' | 'nl' | 'ru' | 'ka';

export type SectionId =
  | 'law'
  | 'history'
  | 'wisdom'
  | 'major-prophets'
  | 'minor-prophets'
  | 'gospels'
  | 'acts'
  | 'pauline'
  | 'general'
  | 'revelation';

export type Book = {
  /** Position in the canon, 1..66. */
  order: number;
  section: SectionId;
  chapters: number;
  /** Exactly one name per locale. No aliases: the game teaches one vocabulary. */
  names: Record<Locale, string>;
};

export const BOOKS = data as readonly Book[];

/** Canon order of the sections. */
export const SECTION_ORDER: readonly SectionId[] = [
  'law',
  'history',
  'wisdom',
  'major-prophets',
  'minor-prophets',
  'gospels',
  'acts',
  'pauline',
  'general',
  'revelation',
];
