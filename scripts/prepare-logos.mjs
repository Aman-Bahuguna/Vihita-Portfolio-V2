import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';

const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const color = (name) => {
  const value = tokens.match(new RegExp(`--${name}:\\s*(#[\\da-f]+)`))?.[1];
  if (!value) throw new Error(`Missing color token: ${name}`);
  return value;
};
const temp = mkdtempSync(join(tmpdir(), 'vihita-logos-'));
const convert = (input, output, args = []) => execFileSync('convert', [
  '-background', 'none', '-density', '384', input, ...args, '-strip', `PNG32:${output}`,
]);

try {
  for (const file of readdirSync('public/logos').filter((name) => name.endsWith('.svg'))) {
    convert(`public/logos/${file}`, `public/logos/${file.replace('.svg', '.png')}`, [
      '-resize', '168x168', '-gravity', 'center', '-extent', '192x192',
      '-channel', 'RGB', '-fill', color('landing-text'), '-colorize', '100', '+channel',
    ]);
  }
  const primitives = readFileSync('src/components/ui/Primitives.tsx', 'utf8');
  const mark = primitives.match(/<svg viewBox="0 0 44 54"[\s\S]*?<\/svg>/)?.[0];
  if (!mark) throw new Error('DoorMark source not found');
  const svg = mark
    .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/ aria-hidden="true" className=\{className\} \{\.\.\.props\}/, '')
    .replaceAll('strokeWidth=', 'stroke-width=');
  for (const [tone, token] of [['accent', 'landing-accent'], ['ink', 'ink']]) {
    const source = join(temp, `${tone}.svg`);
    writeFileSync(source, svg.replaceAll('currentColor', color(token)));
    convert(source, `public/logos/vihita-${tone}.png`, ['-resize', '176x216!']);
  }
  const icon = join(temp, 'icon.svg');
  writeFileSync(icon, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${color('landing-bg')}"/><g transform="translate(10 5)">${svg.match(/<path[\s\S]*<\/svg>/)[0].replace('</svg>', '').replaceAll('currentColor', color('landing-accent'))}</g></svg>`);
  convert(icon, 'public/favicon.png', ['-resize', '64x64!']);
  convert(icon, 'public/apple-touch-icon.png', ['-resize', '180x180!']);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
