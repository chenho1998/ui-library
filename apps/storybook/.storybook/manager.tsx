import * as React from 'react';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Storybook's own UI (sidebar, toolbar) in the library's colours, following the system light/dark setting.
const shared = {
  brandTitle: 'UI Library',
  brandUrl: 'https://github.com/chenho1998/ui-library',
  brandTarget: '_blank',
  appBorderRadius: 10,
  inputBorderRadius: 8,
  fontBase: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

const light = create({
  ...shared,
  base: 'light',
  brandImage: 'logo.svg',
  colorPrimary: '#2c5df5',
  colorSecondary: '#2c5df5',
  appBg: '#f6f7f8',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#d8dbdf',
  textColor: '#282a2d',
  textMutedColor: '#6b7178',
  barBg: '#ffffff',
  barTextColor: '#6b7178',
  barSelectedColor: '#2c5df5',
  barHoverColor: '#2c5df5',
  inputBg: '#ffffff',
  inputBorder: '#d8dbdf',
  inputTextColor: '#282a2d',
});

const dark = create({
  ...shared,
  base: 'dark',
  brandImage: 'logo-dark.svg',
  colorPrimary: '#769fff',
  colorSecondary: '#769fff',
  appBg: '#15171b',
  appContentBg: '#1c1e22',
  appPreviewBg: '#15171b',
  appBorderColor: '#3f4348',
  textColor: '#f6f7f8',
  textMutedColor: '#bfc3c9',
  barBg: '#1c1e22',
  barTextColor: '#bfc3c9',
  barSelectedColor: '#769fff',
  barHoverColor: '#a6c2fe',
  inputBg: '#282a2d',
  inputBorder: '#585d64',
  inputTextColor: '#f6f7f8',
});

const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const theme = prefersDark ? dark : light;

addons.setConfig({
  theme,
  showPanel: false,
  sidebar: {
    showRoots: true,
    // Components introduced in v0.3 carry the `new` tag and get a crisp badge in the menu.
    renderLabel: (item) => {
      const tags = (item as { tags?: string[] }).tags;
      const isLeaf = item.type === 'docs' || item.type === 'story' || item.type === 'component';
      return isLeaf && tags?.includes('new') ? (
        <span className="ui-sb-label">
          <span className="ui-sb-name">{item.name}</span>
          <span className="ui-sb-badge">v0.3</span>
        </span>
      ) : (
        item.name
      );
    },
  },
});
