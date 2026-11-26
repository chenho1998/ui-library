import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import {
  FONT_STACKS, ThemeProvider, Toaster, animeTheme, brutalistTheme, createTheme, neonTheme, pixelTheme, sketchTheme, withFont, type Theme,
} from '@yourorg/ui';
import '../../../packages/ui/src/styles/index.css';
import { ComponentDocPage } from '../stories/ComponentDocPage';
import { ThemedDocsContainer } from '../stories/DocsChrome';
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
  // Unified MUI-style sidebar: each component renders as one clean Docs leaf (stories stay accessible in Docs and /iframe.html).
  tags: ['autodocs', '!dev'],
  // Globals are driven by the custom inline MUI toolbar registered in manager.tsx (no dropdowns).
  initialGlobals: { scheme: 'light', theme: 'default', font: 'theme' },
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    docs: {
      container: ThemedDocsContainer,
      page: ComponentDocPage,
      toc: {
        title: 'On this page',
        headingSelector: 'h2',
      },
    },
    options: {
      storySort: {
        order: [
          'Getting Started', ['Introduction', 'Usage guidelines', 'Themes', 'Migration guide'],
          'Foundations', ['Design tokens', 'Icons'],
          'Inputs & Actions', ['Button', 'Text & Forms', 'ColorPicker', 'Date & Time Pickers', 'FileUpload', 'PinInput', 'Rating', 'SegmentedControl'],
          'Data Display', ['DataTable', 'Carousel', 'Tables & Cards', 'DescriptionList', 'Stat', 'Timeline', 'TreeView'],
          'Feedback', ['Banner', 'Alerts & Toasts'],
          'Navigation & Layout', ['Resizable', 'Sidebar', 'Stepper', 'Menus', 'Tabs & Pagination', 'Collapsible'],
          'Overlays & Utilities', ['CommandPalette', 'Dialogs & Drawers', 'HoverCard', 'Kbd & ScrollArea'],
          'Templates', ['App Shell', 'Settings Page'],
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
      const isFullscreen = ctx.parameters.layout === 'fullscreen';
      const isDocs = ctx.viewMode === 'docs';
      return (
        <ThemeProvider
          colorScheme={ctx.globals.scheme}
          theme={theme}
          style={{ padding: isFullscreen ? 0 : 24, minHeight: isDocs ? undefined : '100vh' }}
        >
          <Story />
          <Toaster />
        </ThemeProvider>
      );
    },
  ],
};
export default preview;
