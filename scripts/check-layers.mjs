// ADR-0001: the platform may not know about any Mode. Types included.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const platformDir = join(root, 'src/platform');
const modesDir = join(root, 'src/modes');

let failed = false;
for (const file of readdirSync(platformDir)) {
  if (!file.endsWith('.ts')) continue;
  const path = join(platformDir, file);
  const lines = readFileSync(path, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const match = /from\s+['"]([^'"]+)['"]/.exec(line);
    if (!match || !match[1].startsWith('.')) return;
    const target = resolve(dirname(path), match[1]);
    if (target === modesDir || target.startsWith(modesDir + '/')) {
      console.error(`src/platform/${file}:${i + 1} imports a Mode: ${match[1]}`);
      failed = true;
    }
  });
}

if (failed) {
  console.error('\nThe platform owns storage, the loop and boards; a Mode owns rules. See docs/adr/0001.');
  process.exit(1);
}
console.log('layers ok: platform imports no Mode');
