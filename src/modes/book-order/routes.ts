import { BOOKS, type Book, type Locale, type SectionId } from '../../content/books';
import type { BoardId } from '../../platform/board';

/** The five Courses, each a contiguous group of Sections. */
export type CourseId =
  | 'genesis-song-of-solomon'
  | 'isaiah-malachi'
  | 'romans-jude'
  | 'genesis-malachi'
  | 'matthew-revelation';

/** What a player picks before a Run: a Course, or the whole canon. */
export type RouteId = CourseId | 'canon';

type Course = {
  readonly id: CourseId;
  readonly sections: readonly SectionId[];
};

const COURSES: readonly Course[] = [
  { id: 'genesis-song-of-solomon', sections: ['law', 'history', 'wisdom'] },
  { id: 'isaiah-malachi', sections: ['major-prophets', 'minor-prophets'] },
  { id: 'romans-jude', sections: ['pauline', 'general'] },
  {
    id: 'genesis-malachi',
    sections: ['law', 'history', 'wisdom', 'major-prophets', 'minor-prophets'],
  },
  {
    id: 'matthew-revelation',
    sections: ['gospels', 'acts', 'pauline', 'general', 'revelation'],
  },
];

export const CANON_FIRST_BOOK: number = BOOKS[0].order;
export const CANON_LAST_BOOK: number = BOOKS[BOOKS.length - 1].order;

/** The six Routes a player picks between, in the order the picker shows them. */
export const ROUTES: readonly RouteId[] = [...COURSES.map((course) => course.id), 'canon'];

const BOARD_OF_ROUTE: Record<RouteId, BoardId> = {
  'genesis-song-of-solomon': 'law-history-wisdom',
  'isaiah-malachi': 'prophets',
  'romans-jude': 'epistles',
  'genesis-malachi': 'hebrew-scriptures',
  'matthew-revelation': 'greek-scriptures',
  canon: 'canon',
};

/** The one board a Route's Runs write to: the Mode declares it, the shell never guesses. */
export function boardOf(route: RouteId): BoardId {
  return BOARD_OF_ROUTE[route];
}

/** Every board this Mode writes to. */
export const MODE_BOARDS: readonly BoardId[] = ROUTES.map(boardOf);

function courseOf(id: CourseId): Course {
  const course = COURSES.find((candidate) => candidate.id === id);
  if (course === undefined) throw new Error(`Unknown Course "${id}"`);
  return course;
}

export function firstBookOfSection(section: SectionId): Book {
  const book = BOOKS.find((candidate) => candidate.section === section);
  if (book === undefined) throw new Error(`Section "${section}" has no Books`);
  return book;
}

function lastBookOfSection(section: SectionId): Book {
  const book = [...BOOKS].reverse().find((candidate) => candidate.section === section);
  if (book === undefined) throw new Error(`Section "${section}" has no Books`);
  return book;
}

/** The Books a Route travels, in canon order. A Course's range is contiguous. */
export function routeBooks(route: RouteId): readonly number[] {
  if (route === 'canon') return BOOKS.map((book) => book.order);
  const course = courseOf(route);
  const first = firstBookOfSection(course.sections[0]).order;
  const last = lastBookOfSection(course.sections[course.sections.length - 1]).order;
  return BOOKS.slice(first - 1, last).map((book) => book.order);
}

export function firstBookOfRoute(route: RouteId): number {
  return route === 'canon' ? CANON_FIRST_BOOK : routeBooks(route)[0];
}

export function lastBookOfRoute(route: RouteId): number {
  if (route === 'canon') return CANON_LAST_BOOK;
  const books = routeBooks(route);
  return books[books.length - 1];
}

/** The Book after `position` on the Route; a Course wraps to its first Book. */
export function nextBookOnRoute(route: RouteId, position: number): number {
  if (route === 'canon') {
    return position === CANON_LAST_BOOK ? CANON_FIRST_BOOK : position + 1;
  }
  const books = routeBooks(route);
  return books[(books.indexOf(position) + 1) % books.length];
}

/** A Route is labelled by its first and last Book, built from the content table. */
export function routeLabel(route: RouteId, locale: Locale): string {
  const books = routeBooks(route);
  return rangeLabel(books[0], books[books.length - 1], locale);
}

/** A Section is labelled the same way, so the picker invents no vocabulary. */
export function sectionLabel(section: SectionId, locale: Locale): string {
  return rangeLabel(firstBookOfSection(section).order, lastBookOfSection(section).order, locale);
}

function rangeLabel(first: number, last: number, locale: Locale): string {
  const lastName = BOOKS[last - 1].names[locale];
  return first === last ? lastName : `${BOOKS[first - 1].names[locale]}–${lastName}`;
}
