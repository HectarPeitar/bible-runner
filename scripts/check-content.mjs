// Checks the content table for every way it could teach a player something
// false. Run: node scripts/check-content.mjs
import { readFileSync } from 'node:fs';

const LOCALES = ['en', 'nl', 'ru', 'ka'];

// Not imported from books.ts: this script must run with no toolchain.
const SECTIONS = [
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

const books = JSON.parse(readFileSync(new URL('../src/content/books.json', import.meta.url), 'utf8'));

const errors = [];
const fail = (message) => errors.push(message);

if (!Array.isArray(books)) fail('books.json must be an array');
else {
  if (books.length !== 66) fail(`expected 66 books, got ${books.length}`);

  let previousSection = -1;
  const seen = new Map(LOCALES.map((l) => [l, new Map()]));

  books.forEach((book, i) => {
    const at = `row ${i + 1}`;
    if (book.order !== i + 1) fail(`${at}: order is ${book.order}, expected ${i + 1}`);

    const sectionIndex = SECTIONS.indexOf(book.section);
    if (sectionIndex === -1) fail(`${at}: unknown section "${book.section}"`);
    if (sectionIndex < previousSection) {
      fail(`${at}: section "${book.section}" breaks canonical section order after "${SECTIONS[previousSection]}"`);
    }
    previousSection = Math.max(previousSection, sectionIndex);

    if (!Number.isInteger(book.chapters) || book.chapters < 1) fail(`${at}: chapters is ${book.chapters}`);

    for (const locale of LOCALES) {
      const name = book.names?.[locale];
      if (typeof name !== 'string' || name.trim() === '') {
        fail(`${at} (${book.names?.en ?? '?'}): no ${locale} name`);
        continue;
      }
      if (name !== name.trim()) fail(`${at} (${locale}): name has stray whitespace "${name}"`);
      // A duplicate name would put the answer on two gates at once.
      const clash = seen.get(locale).get(name);
      if (clash !== undefined) fail(`${locale}: "${name}" names both book ${clash} and ${book.order}`);
      else seen.get(locale).set(name, book.order);
    }
  });
}

// The interface strings, checked the same way: a Locale is offered only when its
// table is complete, so nothing ever renders another Locale's words.
const tables = JSON.parse(
  readFileSync(new URL('../src/content/strings.json', import.meta.url), 'utf8'),
);
const english = tables.en;

if (typeof english !== 'object' || english === null) {
  fail('strings.json: no "en" table to define the keys');
} else {
  const keys = Object.keys(english);
  if (keys.length === 0) fail('strings.json: the "en" table is empty');

  for (const [locale, table] of Object.entries(tables)) {
    if (!LOCALES.includes(locale)) fail(`strings.json: unknown Locale "${locale}"`);
    if (typeof table !== 'object' || table === null) {
      fail(`strings.json: "${locale}" is not a table`);
      continue;
    }
    for (const key of keys) {
      const value = table[key];
      if (typeof value !== 'string' || value.trim() === '') {
        fail(`strings ${locale}: no "${key}"`);
      } else if (value !== value.trim()) {
        fail(`strings ${locale}: "${key}" has stray whitespace "${value}"`);
      }
    }
    for (const key of Object.keys(table)) {
      if (!keys.includes(key)) fail(`strings ${locale}: "${key}" is not a string "en" has`);
    }
    // A Locale offered with interface strings but no Book names would print empty Gates.
    const named =
      Array.isArray(books) &&
      books.every((book) => typeof book.names?.[locale] === 'string' && book.names[locale] !== '');
    if (!named) fail(`strings ${locale}: ships without a Book name in all 66 rows`);
  }
}

if (errors.length) {
  console.error(`content table: ${errors.length} problem(s)`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const sizes = SECTIONS.map((id) => `${id}=${books.filter((b) => b.section === id).length}`);
console.log(`content table ok: 66 books, ${LOCALES.length} locales each, sections ${sizes.join(' ')}`);
console.log(`interface strings ok: ${Object.keys(tables).join(', ')} complete`);
