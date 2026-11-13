import { afterEach, describe, expect, it, vi } from 'vitest';
import { entriesOf, recordScore } from './board';
import { loadSettings, saveSettings } from './storage';

const refusing = {
  getItem: (): never => {
    throw new Error('storage refused');
  },
  setItem: (): never => {
    throw new Error('storage refused');
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage: one key, and a game that plays without it', () => {
  it('remembers the chosen Locale across a reload', () => {
    const kept = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => kept.get(key) ?? null,
      setItem: (key: string, value: string) => {
        kept.set(key, value);
      },
    });

    expect(loadSettings().locale).toBeNull();
    saveSettings({ ...loadSettings(), locale: 'en' });

    expect(loadSettings().locale).toBe('en');
    expect(kept.get('bible-runner:v1')).toBe('{"locale":"en","name":"","boards":{}}');
  });

  it('plays when the browser refuses storage', () => {
    vi.stubGlobal('localStorage', refusing);

    expect(loadSettings()).toEqual({ locale: null, name: '', boards: {} });
    expect(() => saveSettings({ locale: 'en', name: '', boards: {} })).not.toThrow();
  });

  it('ignores a stored object it did not write', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => '{"locale":42,"name":null,"boards":[]}',
      setItem: () => undefined,
    });

    expect(loadSettings()).toEqual({ locale: null, name: '', boards: {} });
  });
});

describe('storage: the boards it keeps', () => {
  it('reads back the boards it wrote, with the speed curve they were recorded under', () => {
    const kept = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => kept.get(key) ?? null,
      setItem: (key: string, value: string) => {
        kept.set(key, value);
      },
    });

    const board = recordScore(undefined, 1, { name: 'Sam', score: 700, at: 1 });
    saveSettings({ locale: 'en', name: 'Sam', boards: { canon: board } });

    const loaded = loadSettings();
    expect(loaded.name).toBe('Sam');
    expect(entriesOf(loaded.boards.canon, 1)).toEqual([{ name: 'Sam', score: 700, at: 1 }]);
  });

  it('trusts no board that came back: a corrupt entry drops out and a corrupt board is no board', () => {
    vi.stubGlobal('localStorage', {
      getItem: () =>
        JSON.stringify({
          locale: 'en',
          name: 'Sam',
          boards: {
            canon: {
              curve: 1,
              entries: [
                { name: 'Sam', score: 700, at: 1 },
                { name: 42, score: 'high' },
                { name: 'x'.repeat(30), score: -1, at: 2 },
              ],
            },
            epistles: { curve: 'one', entries: [] },
            prophets: 'nope',
          },
        }),
      setItem: () => undefined,
    });

    const settings = loadSettings();
    expect(entriesOf(settings.boards.canon, 1)).toEqual([{ name: 'Sam', score: 700, at: 1 }]);
    expect(settings.boards.epistles).toBeUndefined();
    expect(entriesOf(settings.boards.epistles, 1)).toEqual([]);
    expect(entriesOf(settings.boards.prophets, 1)).toEqual([]);
  });

  it('plays and keeps the score in hand when the browser refuses the write', () => {
    vi.stubGlobal('localStorage', refusing);

    const settings = loadSettings();
    const board = recordScore(settings.boards.canon, 1, { name: 'Sam', score: 700, at: 1 });
    const next = { ...settings, name: 'Sam', boards: { ...settings.boards, canon: board } };

    expect(() => saveSettings(next)).not.toThrow();
    expect(entriesOf(next.boards.canon, 1).map((entry) => entry.score)).toEqual([700]);
    expect(loadSettings().boards.canon).toBeUndefined();
  });
});
