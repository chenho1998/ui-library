import { createTheme, M_PLUS_ROUNDED_STACK, MOCHIY_POP_ONE_STACK } from './createTheme';

/**
 * Opt-in anime component style: hot-pink brand, cel-shaded buttons, 2.5 px ink outlines, chunky offset
 * shadows that squash on press, sparkles on hover and focus, screentone on ghost hover and wavy links.
 * Display face Mochiy Pop One, body M PLUS Rounded 1c (load both in your app, e.g. from Fontsource).
 *
 * ```tsx
 * <ThemeProvider theme={animeTheme}>…</ThemeProvider>
 * ```
 * Combine with `withFont(animeTheme, FONT_STACKS.openDyslexic)` to swap the fonts and keep the look.
 */
export const animeTheme = /* @__PURE__ */ createTheme({
  brand: '#ff2e88',
  style: 'anime',
  tokens: {
    radius: { sm: '8px', md: '12px', lg: '18px' },
    font: { sans: M_PLUS_ROUNDED_STACK, display: MOCHIY_POP_ONE_STACK, displayWeight: 400 },
  },
  colors: {
    light: {
      bg: '#fff7fb',
      'anime-ink': '#2b0f2e',
      'anime-shadow': '#2b0f2e',
      'anime-sparkle': '#ffb300',
    },
    dark: {
      bg: '#180d1d',
      surface: '#231428',
      'surface-subtle': '#2e1c35',
      'surface-muted': '#3a2543',
      border: '#4a3354',
      'anime-ink': '#ffd9ec',
      'anime-shadow': '#cb0567',
      'anime-sparkle': '#ffe066',
    },
  },
});
