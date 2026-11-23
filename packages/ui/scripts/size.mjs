// Bundle-size budgets (spec: Technical architecture). Bundles each import the way an app would,
// with React external, then measures gzip size. Fails if any entry is over budget.
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const budgets = [
  { name: 'Button', imports: 'Button', kb: 3 },
  { name: 'TextField with Field', imports: 'TextField', kb: 4 },
  { name: 'Dialog, including its primitive', imports: 'Dialog', kb: 15 },
  { name: 'Typical page: Button, TextField, Dialog', imports: 'Button, TextField, Dialog, ThemeProvider', kb: 30 },
  { name: 'Everything', imports: '*', kb: 70 },
];

let failed = false;
for (const b of budgets) {
  const contents = b.imports === '*' ? `export * from ${JSON.stringify(dist)};` : `export { ${b.imports} } from ${JSON.stringify(dist)};`;
  const res = await build({
    stdin: { contents, resolveDir: process.cwd(), loader: 'js' },
    bundle: true, minify: true, format: 'esm', write: false, logLevel: 'silent',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  });
  const kb = gzipSync(res.outputFiles[0].contents).length / 1024;
  const ok = kb <= b.kb;
  failed ||= !ok;
  console.log(`${ok ? '✓' : '✗'} ${b.name.padEnd(42)} ${kb.toFixed(1).padStart(5)} KB gzip  (budget ${b.kb} KB)`);
}
process.exit(failed ? 1 : 0);
