import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const references = new Set(['/favicon.png', '/apple-touch-icon.png']);
const collect = (value) => {
  if (typeof value === 'string' && /^\/(assets|models|logos|fonts)\//.test(value)) references.add(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};
collect(JSON.parse(readFileSync('src/data/projects.json', 'utf8')));
const scan = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) {
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/["'(](\/(?:assets|models|logos|fonts)\/[^"')\s{}$]+)["')]/g)) references.add(match[1]);
    }
  }
};
scan('src');

for (const file of readdirSync('public/logos').filter((name) => name.endsWith('.png'))) {
  references.add(`/logos/${file}`);
  const bytes = readFileSync(`public/logos/${file}`);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Invalid PNG: ${file}`);
  assert(bytes.readUInt32BE(16) >= 176 && bytes.readUInt32BE(20) >= 192, `Insufficient logo resolution: ${file}`);
}
for (const path of references) assert(existsSync(`public${path}`), `Missing local asset: ${path}`);
console.log(`PASS ${references.size} local image, logo, font, model, and PDF references`);

const baseURL = process.argv[2];
if (baseURL) {
  const paths = [...references];
  for (let index = 0; index < paths.length; index += 8) {
    await Promise.all(paths.slice(index, index + 8).map(async (path) => {
      const response = await fetch(new URL(path, baseURL), { method: 'HEAD' });
      assert(response.ok, `${response.status}: ${path}`);
      const type = response.headers.get('content-type') ?? '';
      assert(!type.includes('text/html'), `SPA HTML returned instead of asset: ${path}`);
      if (/\.(png|webp)$/.test(path)) assert(type.startsWith('image/'), `Incorrect image MIME type: ${path} (${type})`);
    }));
  }
  console.log(`PASS all ${paths.length} HTTP asset responses and image MIME types`);
}
