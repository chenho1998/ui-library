// Concatenates tokens + component CSS into dist/styles.css inside cascade layers,
// so any un-layered app CSS overrides the library without !important.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const tokens = readFileSync(require.resolve('@yourorg/tokens/tokens.css'), 'utf8');
const parts = ['styles/base.css', 'layout/layout.css', 'actions/actions.css', 'forms/forms.css', 'overlays/overlays.css', 'feedback/feedback.css', 'navigation/navigation.css', 'data/data.css', 'navigation/more.css', 'forms/more.css', 'overlays/more.css', 'data/more.css', 'styles/expressive.css', 'styles/themes.css'];
const components = parts.map((p) => `/* ${p} */\n` + readFileSync(join(root, 'src', p), 'utf8')).join('\n');
const out = `@layer ui.reset, ui.tokens, ui.components;\n${tokens}\n@layer ui.components {\n${components}\n}\n`;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/styles.css'), out);
const gz = gzipSync(out).length / 1024;
// Raised from 12 KB in v0.2: 19 more components and five expressive themes (14.5 KB at the time).
const BUDGET_KB = 16;
console.log(`styles.css written (${(out.length / 1024).toFixed(1)} KB, ${gz.toFixed(1)} KB gzipped, budget ${BUDGET_KB} KB)`);
if (gz > BUDGET_KB) {
  console.error('styles.css is over its size budget');
  process.exit(1);
}
