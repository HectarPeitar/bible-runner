import { describe, expect, it } from 'vitest';
import { LOCALES_OFFERED, fill, offeredLocales, resolveLocale, strings } from './strings';

const complete = { ...strings('en') };

const without = (key: string): Record<string, string> => {
  const table: Record<string, string> = { ...complete };
  delete table[key];
  return table;
};

describe('Locale: the interface speaks one Locale', () => {
  it('offers a Locale only when every interface string is present, non-empty and trimmed', () => {
    expect(offeredLocales({ en: complete, nl: complete })).toEqual(['en', 'nl']);
    expect(offeredLocales({ en: complete, nl: without('play') })).toEqual(['en']);
    expect(offeredLocales({ en: complete, nl: { ...complete, play: '' } })).toEqual(['en']);
    expect(offeredLocales({ en: complete, nl: { ...complete, play: ' Play ' } })).toEqual(['en']);
    expect(offeredLocales({ en: complete, nl: { ...complete, stray: 'Play' } })).toEqual(['en']);
  });

  it('ships English complete, and nothing else yet', () => {
    expect(LOCALES_OFFERED).toEqual(['en']);
  });

  it('has no English copy to lend a Locale whose table is unfinished', () => {
    expect(offeredLocales({ nl: without('play') })).toEqual([]);
    expect(() => strings('nl')).toThrow('Locale "nl" has no complete string table');
  });

  it('defaults to the browser’s language when it is offered, otherwise English', () => {
    expect(resolveLocale(null, 'nl-BE', ['en', 'nl'])).toBe('nl');
    expect(resolveLocale(null, 'nl-BE', ['en'])).toBe('en');
    expect(resolveLocale(null, 'ka', ['en', 'ka'])).toBe('ka');
    expect(resolveLocale('nl', 'ru', ['en', 'nl'])).toBe('nl');
    expect(resolveLocale('ru', 'en-GB', ['en', 'nl'])).toBe('en');
  });

  it('fills a template with the words the Run is carrying', () => {
    const { after, status } = strings('en');
    expect(fill(after, { book: 'Genesis' })).toBe('After Genesis');
    expect(fill(status, { speed: '1.4×' })).toBe('Speed 1.4×');
  });
});
