// Adds 'use client' to the top of dist/index.js so React Server Components frameworks
// (Next.js App Router) treat the library as client code. tsup's `banner` can't do this:
// its Rollup tree-shaking pass strips module-level directives. The source map is shifted
// down one line (a leading ';' in `mappings` is an empty first line) so it stays accurate.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIRECTIVE = "'use client';";
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const jsPath = join(dist, 'index.js');
const mapPath = join(dist, 'index.js.map');

const code = readFileSync(jsPath, 'utf8');
if (!code.startsWith(DIRECTIVE)) {
  writeFileSync(jsPath, `${DIRECTIVE}\n${code}`);
  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  map.mappings = `;${map.mappings}`;
  writeFileSync(mapPath, JSON.stringify(map));
}

if (!readFileSync(jsPath, 'utf8').startsWith(`${DIRECTIVE}\n`)) {
  console.error(`dist/index.js does not start with ${DIRECTIVE}`);
  process.exit(1);
}
console.log(`${DIRECTIVE} added to dist/index.js`);
