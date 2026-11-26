import { createTheme } from './createTheme';
import { EXO_2, M_PLUS_ROUNDED, MOCHIY_POP_ONE, ORBITRON, PATRICK_HAND, PIXELIFY_SANS, SILKSCREEN, SPACE_GROTESK } from './fonts';

// Built-in expressive themes. Each one restyles every component with one switch:
//   <ThemeProvider theme={pixelTheme}>…</ThemeProvider>
// Their look comes from style tokens (`components: { 'style-…' }`) read by expressive.css, plus a few
// theme-only effects in themes.css. Arguments are literals and constants only, so unused themes tree-shake away.

const SQUARE = { none: '0', sm: '0', md: '0', lg: '0', xl: '0', full: '0' };

/** Hot-pink anime look: cel-shaded buttons, ink outlines, squashy offset shadows, sparkles, screentone, wavy links. */
export const animeTheme = /* @__PURE__ */ createTheme({
  brand: '#ff2e88',
  style: 'anime',
  tokens: {
    radius: { sm: '8px', md: '12px', lg: '18px' },
    font: { sans: M_PLUS_ROUNDED, display: MOCHIY_POP_ONE, displayWeight: 400 },
  },
  components: {
    'style-border-width': '2.5px',
    'style-offset': '3px',
    'style-press': 'translate(2px, 2px) scale(1.03, 0.94)',
    'style-raise': 'translate(-2px, -2px)',
    'style-button-fill': 'linear-gradient(180deg, transparent 0 10%, rgb(255 255 255 / 30%) 10% 40%, transparent 40%)',
    'style-hover-fill': 'radial-gradient(color-mix(in srgb, currentcolor 30%, transparent) 1px, transparent 1.4px)',
    'style-hover-fill-size': '5px 5px',
    'style-link-line': 'wavy',
    'style-divider': 'dashed',
    'style-heading-shadow': '2px 2px 0 color-mix(in srgb, var(--ui-color-accent) 30%, transparent)',
    'style-bar-fill': 'repeating-linear-gradient(-45deg, transparent 0 6px, rgb(255 255 255 / 30%) 6px 12px)',
    'style-backdrop': 'radial-gradient(rgb(255 255 255 / 14%) 1px, transparent 1.5px)',
    'style-backdrop-size': '6px 6px',
  },
  colors: {
    light: { bg: '#fff7fb', 'style-ink': '#2b0f2e', 'style-shadow': '#2b0f2e', 'anime-sparkle': '#ffb300' },
    dark: {
      bg: '#180d1d', surface: '#231428', 'surface-subtle': '#2e1c35', 'surface-muted': '#3a2543', border: '#4a3354',
      'style-ink': '#ffd9ec', 'style-shadow': '#cb0567', 'anime-sparkle': '#ffe066',
    },
  },
});

/** 8-bit game look: square notched outlines, pixel type, bevelled buttons, checker hover, dithered backdrop. */
export const pixelTheme = /* @__PURE__ */ createTheme({
  brand: '#3d5afe',
  style: 'pixel',
  tokens: { radius: SQUARE, font: { sans: PIXELIFY_SANS, display: SILKSCREEN, displayWeight: 400 } },
  components: {
    'style-border-width': '0px',
    'style-offset': '4px',
    'style-press': 'translate(4px, 4px)',
    'style-raise': 'translate(-2px, -2px)',
    'style-button-fill': 'linear-gradient(180deg, rgb(255 255 255 / 28%) 0 3px, transparent 3px calc(100% - 3px), rgb(0 0 0 / 25%) calc(100% - 3px))',
    'style-hover-fill': 'repeating-conic-gradient(color-mix(in srgb, currentcolor 16%, transparent) 0 25%, transparent 0 50%)',
    'style-hover-fill-size': '6px 6px',
    'style-link-line': 'dotted',
    'style-divider': 'dotted',
    'style-heading-shadow': '3px 3px 0 color-mix(in srgb, var(--ui-color-accent) 35%, transparent)',
    'style-bar-fill': 'repeating-linear-gradient(90deg, transparent 0 8px, rgb(0 0 0 / 28%) 8px 10px)',
    'style-backdrop': 'repeating-conic-gradient(rgb(0 0 0 / 30%) 0 25%, transparent 0 50%)',
    'style-backdrop-size': '4px 4px',
  },
  colors: {
    light: { bg: '#f4f1e6', 'text-secondary': '#5f646b', 'style-ink': '#1d1b33', 'style-shadow': '#1d1b33' },
    dark: {
      bg: '#0f1020', surface: '#191a30', 'surface-subtle': '#21233d', 'surface-muted': '#2a2d4a', border: '#3a3d5e',
      'style-ink': '#e6e8ff', 'style-shadow': '#3d5afe',
    },
  },
});

/** Neo-brutalist look: thick black borders, flat yellow, big hard shadows, square corners, uppercase buttons. */
export const brutalistTheme = /* @__PURE__ */ createTheme({
  brand: '#ffd400',
  style: 'brutalist',
  tokens: { radius: SQUARE, font: { sans: SPACE_GROTESK, display: SPACE_GROTESK, displayWeight: 700 } },
  components: {
    'style-border-width': '3px',
    'style-offset': '5px',
    'style-press': 'translate(3px, 3px)',
    'style-raise': 'translate(-3px, -3px)',
    'style-button-case': 'uppercase',
    'style-hover-fill': 'linear-gradient(color-mix(in srgb, var(--ui-color-accent) 60%, transparent) 0 0)',
  },
  colors: {
    light: {
      bg: '#fffbe6', accent: '#ffd400', 'accent-hover': '#ffc400', 'accent-active': '#f2b600', 'accent-subtle': '#fff2a8',
      'accent-text': '#000000', 'text-on-accent': '#000000', 'focus-ring': '#000000', danger: '#e8423a', 'danger-hover': '#d93a32',
      'style-ink': '#000000', 'style-shadow': '#000000',
    },
    dark: {
      bg: '#111111', surface: '#1a1a1a', 'surface-subtle': '#222222', 'surface-muted': '#2c2c2c', border: '#3d3d3d',
      accent: '#ffd400', 'accent-hover': '#ffe14d', 'accent-active': '#ffeb85', 'accent-subtle': '#3a3000', 'accent-text': '#ffd400',
      'text-on-accent': '#000000', 'focus-ring': '#ffd400', danger: '#ff6b6b', 'danger-hover': '#ff8787',
      'style-ink': '#f5f5f5', 'style-shadow': '#ffd400',
    },
  },
});

/** Hand-drawn look: wobbly pencil outlines, handwriting, hatched hover, notebook lines; a chalkboard in dark mode. */
export const sketchTheme = /* @__PURE__ */ createTheme({
  brand: '#2457c5',
  style: 'sketch',
  tokens: {
    radius: {
      sm: '10px 3px 9px 4px / 4px 9px 3px 10px',
      md: '255px 15px 225px 15px / 15px 225px 15px 255px',
      lg: '255px 25px 225px 25px / 25px 225px 25px 255px',
      xl: '255px 25px 225px 25px / 25px 225px 25px 255px',
    },
    font: { sans: PATRICK_HAND, display: PATRICK_HAND, displayWeight: 400 },
  },
  components: {
    'style-border-width': '2px',
    'style-offset': '2px',
    'style-press': 'rotate(-1.5deg) translate(1px, 1px)',
    'style-raise': 'rotate(-1deg) translate(-1px, -2px)',
    'style-button-weight': '400',
    'style-hover-fill': 'repeating-linear-gradient(-45deg, color-mix(in srgb, currentcolor 25%, transparent) 0 1.5px, transparent 1.5px 6px)',
    'style-divider': 'dashed',
    'style-bar-fill': 'repeating-linear-gradient(-45deg, transparent 0 4px, rgb(255 255 255 / 35%) 4px 6px)',
    'style-page': 'repeating-linear-gradient(transparent 0 31px, color-mix(in srgb, var(--ui-color-accent) 14%, transparent) 31px 32px)',
  },
  colors: {
    light: { bg: '#fdfbf3', 'style-ink': '#33302b', 'style-shadow': 'rgb(51 48 43 / 28%)' },
    dark: {
      bg: '#141e19', surface: '#1b2821', 'surface-subtle': '#213128', 'surface-muted': '#293b31', border: '#384e42',
      'border-strong': '#6a8275', 'style-ink': '#efeadb', 'style-shadow': 'rgb(0 0 0 / 45%)',
    },
  },
});

/** 80s synthwave look: glowing magenta and cyan outlines, grid background, Orbitron headings. Best in dark mode. */
export const neonTheme = /* @__PURE__ */ createTheme({
  brand: '#e335ff',
  style: 'neon',
  tokens: { radius: { md: '10px', lg: '14px' }, font: { sans: EXO_2, display: ORBITRON, displayWeight: 700 } },
  components: {
    'style-border-width': '1.5px',
    'style-offset': '0px',
    'style-blur': '10px',
    'style-press': 'scale(0.97)',
    'style-raise': 'translateY(-2px)',
    'style-button-weight': '600',
    'style-button-case': 'uppercase',
    'style-button-fill': 'linear-gradient(135deg, rgb(255 255 255 / 0%) 40%, rgb(255 255 255 / 22%))',
    'style-hover-fill': 'linear-gradient(90deg, transparent, color-mix(in srgb, currentcolor 18%, transparent), transparent)',
    'style-heading-shadow': '0 0 12px color-mix(in srgb, var(--ui-color-accent) 70%, transparent)',
    'style-bar-fill': 'linear-gradient(90deg, rgb(255 255 255 / 0%), rgb(255 255 255 / 40%))',
    'style-page':
      'linear-gradient(color-mix(in srgb, var(--ui-color-accent) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--ui-color-accent) 8%, transparent) 1px, transparent 1px)',
    'style-page-size': '40px 40px',
  },
  colors: {
    light: { bg: '#f8f4ff', 'style-ink': '#9b1fb8', 'style-shadow': 'rgb(0 190 220 / 55%)' },
    dark: {
      bg: '#0c0420', surface: '#150a33', 'surface-subtle': '#1d0f44', 'surface-muted': '#271556', border: '#3a2172',
      'style-ink': '#2de2e6', 'style-shadow': 'rgb(255 47 214 / 70%)',
    },
  },
});
