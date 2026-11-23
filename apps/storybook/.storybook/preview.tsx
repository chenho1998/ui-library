import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, Toaster, createTheme } from '@yourorg/ui';
import '../../../packages/ui/src/styles/index.css';

const brands = {
  default: undefined,
  violet: createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px', lg: '10px' } } }),
  teal: createTheme({ brand: '#0d9488', tokens: { radius: { md: '999px' } } }),
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: { title: 'Scheme', icon: 'mirror', items: ['light', 'dark', 'system'], dynamicTitle: true },
    },
    brand: {
      description: 'Brand theme from createTheme()',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: Object.keys(brands), dynamicTitle: true },
    },
  },
  initialGlobals: { scheme: 'light', brand: 'default' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, ctx) => (
      <ThemeProvider
        colorScheme={ctx.globals.scheme}
        theme={brands[ctx.globals.brand as keyof typeof brands]}
        style={{ padding: 24, minHeight: '100vh' }}
      >
        <Story />
        <Toaster />
      </ThemeProvider>
    ),
  ],
};
export default preview;
