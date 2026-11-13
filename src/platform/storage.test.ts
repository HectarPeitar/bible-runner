import { afterEach, describe, expect, it, vi } from 'vitest';
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
