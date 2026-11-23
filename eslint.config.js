// ESLint flat config for the whole monorepo: TypeScript, React hooks and accessibility rules.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  {
    // Build scripts and configs run in Node.
    files: ['**/*.{js,mjs}', '**/*.config.ts', '**/.storybook/**'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Tests may use `any` to patch jsdom gaps.
    files: ['**/test/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
