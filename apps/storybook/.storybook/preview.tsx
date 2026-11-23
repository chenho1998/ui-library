import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import {
  FONT_STACKS, ThemeProvider, Toaster, animeTheme, brutalistTheme, createTheme, neonTheme, pixelTheme, sketchTheme, withFont, type Theme,
} from '@yourorg/ui';
import '../../../packages/ui/src/styles/index.css';
// Fonts load from Fontsource packages (no font CDN). An app imports only the faces its themes use.
import '@fontsource/m-plus-rounded-1c/400.css';
import '@fontsource/m-plus-rounded-1c/500.css';
import '@fontsource/m-plus-rounded-1c/700.css';
import '@fontsource/mochiy-pop-one/400.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/patrick-hand/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';

// Switching the theme is the only change needed: colours, shapes and component style all follow it.
const themes: Record<string, Theme | undefined> = {
  default: undefined,
  violet: createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px', lg: '10px' } } }),
  teal: createTheme({ brand: '#0d9488', tokens: { radius: { md: '999px' } } }),
  anime: animeTheme,
  pixel: pixelTheme,
  brutalist: brutalistTheme,
  sketch: sketchTheme,
  neon: neonTheme,
};

const fonts = {
  theme: (t: Theme | undefined) => t,
  openDyslexic: (t: Theme | undefined) => withFont(t, FONT_STACKS.openDyslexic, { displayWeight: 700 }),
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: { title: 'Scheme', icon: 'mirror', items: ['light', 'dark', 'system'], dynamicTitle: true },
    },
    theme: {
      description: 'Theme: one switch restyles every component',
      toolbar: { title: 'Theme', icon: 'paintbrush', items: Object.keys(themes), dynamicTitle: true },
    },
    font: {
      description: 'Font: the theme’s own, or OpenDyslexic everywhere via withFont()',
      toolbar: {
        title: 'Font',
        icon: 'eye',
        items: [
          { value: 'theme', title: 'Theme font' },
          { value: 'openDyslexic', title: 'OpenDyslexic' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { scheme: 'light', theme: 'default', font: 'theme' },
  parameters: {
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Get started', ['Introduction', 'Themes'],
          'Foundations',
          'Components', ['Actions', 'Forms', 'Navigation', 'Overlays', 'Feedback', 'Data display'],
          'Patterns',
        ],
      },
    },
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, ctx) => {
      const base = themes[ctx.globals.theme as string] ?? themes.default;
      const theme = fonts[(ctx.globals.font as keyof typeof fonts) ?? 'theme'](base);
      return (
        <ThemeProvider colorScheme={ctx.globals.scheme} theme={theme} style={{ padding: 24, minHeight: '100vh' }}>
          <Story />
          <Toaster />
        </ThemeProvider>
      );
    },
  ],
};
export default preview;
