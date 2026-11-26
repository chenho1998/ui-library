import {
  FONT_STACKS, animeTheme, brutalistTheme, createTheme, neonTheme, pixelTheme, sketchTheme, withFont, type Theme,
} from '@yourorg/ui';

export const storybookThemes: Record<string, Theme | undefined> = {
  default: undefined,
  violet: createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px', lg: '10px' } } }),
  teal: createTheme({ brand: '#0d9488', tokens: { radius: { md: '999px' } } }),
  anime: animeTheme,
  pixel: pixelTheme,
  brutalist: brutalistTheme,
  sketch: sketchTheme,
  neon: neonTheme,
};

export function resolveStorybookTheme(themeId: unknown, fontId: unknown): Theme | undefined {
  const base = storybookThemes[String(themeId ?? 'default')] ?? storybookThemes.default;
  return fontId === 'openDyslexic' ? withFont(base, FONT_STACKS.openDyslexic, { displayWeight: 700 }) : base;
}
