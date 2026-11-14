// Screenshot the game with the Chromium already on this machine. No dependencies.
//   npm run shot                      -> http://localhost:5173 to /tmp/book-order.png
//   npm run shot -- <url> <out.png>   -> anywhere else
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const cache = join(homedir(), '.cache/ms-playwright');
  if (existsSync(cache)) {
    const versions = readdirSync(cache)
      .filter((d) => d.startsWith('chromium-'))
      .sort()
      .reverse();
    for (const v of versions) {
      for (const bin of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
        const path = join(cache, v, bin);
        if (existsSync(path)) return path;
      }
    }
  }
  for (const path of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (existsSync(path)) return path;
  }
  throw new Error('No Chromium found. Set CHROME_BIN=/path/to/chrome.');
}

const url = process.argv[2] ?? 'http://localhost:5173';
const out = resolve(process.argv[3] ?? '/tmp/book-order.png');

execFileSync(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1200,900',
    '--virtual-time-budget=3000',
    `--screenshot=${out}`,
    url,
  ],
  { stdio: 'inherit' },
);

if (!existsSync(out)) throw new Error(`Chromium wrote no screenshot. Is ${url} running? Try: npm run dev`);
console.log(`shot: ${out}`);
