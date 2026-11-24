import { defineConfig } from 'tsup';

// 'use client' is added by scripts/add-use-client.mjs after this build: a `banner` would be
// stripped by the Rollup tree-shaking pass.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', /^@radix-ui\//, '@yourorg/tokens', '@yourorg/icons'],
});
