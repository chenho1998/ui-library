import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const uiSrc = fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  staticDirs: ['../public'],
  core: { disableWhatsNewNotifications: true },
  // Work against the component source so edits hot-reload.
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    cfg.resolve.alias = { ...(cfg.resolve.alias as Record<string, string>), '@yourorg/ui': uiSrc };
    return cfg;
  },
};
export default config;
