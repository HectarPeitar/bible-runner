import { afterEach, describe, expect, it, vi } from 'vitest';
import { entriesOf, recordScore } from './board';
import { boostReady, loadSettings, saveSettings, setBoost } from './storage';

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

    expect(loadSettings()).toEqual({ locale: 'en', name: '', boards: {}, boosts: {} });
  });

  it('plays when the browser refuses storage', () => {
    vi.stubGlobal('localStorage', refusing);

    expect(loadSettings()).toEqual({ locale: null, name: '', boards: {}, boosts: {} });
    expect(() => saveSettings({ locale: 'en', name: '', boards: {}, boosts: {} })).not.toThrow();
  });

  it('ignores a stored object it did not write', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => '{"locale":42,"name":null,"boards":[],"boosts":"yes"}',
      setItem: () => undefined,
    });

    expect(loadSettings()).toEqual({ locale: null, name: '', boards: {}, boosts: {} });
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
    saveSettings({ locale: 'en', name: 'Sam', boards: { canon: board }, boosts: {} });

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

describe('storage: one Start boost per Route', () => {
  const writable = (): Map<string, string> => {
    const kept = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => kept.get(key) ?? null,
      setItem: (key: string, value: string) => {
        kept.set(key, value);
      },
    });
    return kept;
  };

  it('keeps a clean Route’s boost across a reload until a Run spends it', () => {
    writable();
    saveSettings(setBoost(loadSettings(), 'canon', true));
    expect(boostReady(loadSettings(), 'canon')).toBe(true);

    saveSettings(setBoost(loadSettings(), 'canon', false));
    expect(boostReady(loadSettings(), 'canon')).toBe(false);
  });

  it('never offers a Route’s boost on another Route', () => {
    writable();
    saveSettings(setBoost(loadSettings(), 'isaiah-malachi', true));

    expect(boostReady(loadSettings(), 'isaiah-malachi')).toBe(true);
    expect(boostReady(loadSettings(), 'canon')).toBe(false);
    expect(boostReady(loadSettings(), 'romans-jude')).toBe(false);
  });

  it('trusts no stored boost: only a true is a boost, and a Route it does not know stays harmless', () => {
    vi.stubGlobal('localStorage', {
      getItem: () =>
        JSON.stringify({
          locale: 'en',
          name: 'Sam',
          boards: {},
          boosts: { canon: 'yes', 'romans-jude': 1, 'isaiah-malachi': true, nope: true },
        }),
      setItem: () => undefined,
    });

    const settings = loadSettings();
    expect(boostReady(settings, 'canon')).toBe(false);
    expect(boostReady(settings, 'romans-jude')).toBe(false);
    expect(boostReady(settings, 'isaiah-malachi')).toBe(true);
    // A Mode's Routes are the Mode's to name: an unknown key is kept, never offered.
    expect(Object.keys(settings.boosts)).toEqual(['isaiah-malachi', 'nope']);
  });

  it('records the second clean Route as the same one boost, never a bigger one', () => {
    writable();
    saveSettings(setBoost(setBoost(loadSettings(), 'canon', true), 'canon', true));

    expect(loadSettings().boosts).toEqual({ canon: true });
  });
});
