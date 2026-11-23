import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contrast, semanticRefs, tokens } from '@yourorg/tokens';
import {
  Button, FONT_STACKS, ThemeProvider, animeTheme, brutalistTheme, createTheme, neonTheme, pixelTheme, sketchTheme, withFont, type Theme,
} from '../src';

const THEMES = { anime: animeTheme, pixel: pixelTheme, brutalist: brutalistTheme, sketch: sketchTheme, neon: neonTheme };

const rootOf = (container: HTMLElement) => container.querySelector('.ui-theme')!;

// The token build's contrast pairs (text 4.5:1, UI parts 3:1).
const PAIRS: Array<[string, string, number]> = [
  ['text-primary', 'bg', 4.5], ['text-primary', 'surface', 4.5], ['text-secondary', 'bg', 4.5],
  ['text-secondary', 'surface-subtle', 4.5], ['text-on-accent', 'accent', 4.5], ['text-on-accent', 'accent-hover', 4.5],
  ['accent-text', 'bg', 4.5], ['danger-text', 'danger-subtle', 4.5], ['success-text', 'success-subtle', 4.5],
  ['warning-text', 'warning-subtle', 4.5], ['info-text', 'info-subtle', 4.5], ['border-strong', 'bg', 3],
  ['focus-ring', 'bg', 3], ['danger', 'bg', 3], ['text-on-accent', 'danger', 4.5],
];

/** The semantic colours a theme ends up with: defaults, its brand palette, then its own overrides. */
function resolvedColors(theme: Theme, scheme: 'light' | 'dark') {
  const colors = { ...(tokens as unknown as { color: Record<string, Record<string, string>> }).color[scheme] };
  for (const [name, ref] of Object.entries(semanticRefs[scheme])) {
    const step = /^\{brand\.(\d+)\}$/.exec(ref)?.[1];
    if (step && theme.vars[`--ui-brand-${step}`]) colors[name] = theme.vars[`--ui-brand-${step}`]!;
  }
  for (const [cssVar, value] of Object.entries(theme.schemes[scheme])) colors[cssVar.replace('--ui-color-', '')] = value;
  return colors;
}

describe('Anime theme', () => {
  it('restyles everything inside the provider with one theme switch', () => {
    const plain = render(<ThemeProvider><Button>Save</Button></ThemeProvider>);
    expect(rootOf(plain.container)).not.toHaveAttribute('data-ui-style');
    plain.unmount();

    const { container } = render(<ThemeProvider theme={animeTheme}><Button>Save</Button></ThemeProvider>);
    const root = rootOf(container) as HTMLElement;
    expect(root).toHaveAttribute('data-ui-style', 'anime');
    expect(root.style.getPropertyValue('--ui-brand-600')).toBe(animeTheme.vars['--ui-brand-600']);
    expect(root.style.getPropertyValue('--ui-font-display')).toBe(FONT_STACKS.mochiyPopOne);
    expect(root.style.getPropertyValue('--ui-font-sans')).toBe(FONT_STACKS.mPlusRounded);
  });

});

describe('Built-in themes', () => {
  const cases = Object.entries(THEMES).flatMap(([name, theme]) => (['light', 'dark'] as const).map((scheme) => [name, scheme, theme] as const));

  it.each(cases)('%s meets the token contrast targets in %s mode', (_name, scheme, theme) => {
    const colors = resolvedColors(theme, scheme);
    const failures = PAIRS.filter(([fg, bg, min]) => contrast(colors[fg]!, colors[bg]!) < min).map(
      ([fg, bg, min]) => `${fg} on ${bg}: ${contrast(colors[fg]!, colors[bg]!).toFixed(2)} < ${min}`,
    );
    expect(failures).toEqual([]);
    // Outlines must stand out from the page.
    expect(contrast(colors['style-ink']!, colors.bg!)).toBeGreaterThanOrEqual(3);
  });

  it.each(Object.entries(THEMES))('%s sets its style name and style tokens', (name, theme) => {
    expect(theme.style).toBe(name);
    expect(theme.vars['--ui-style-border-width']).toBeDefined();
    expect(theme.vars['--ui-font-display']).toBeDefined();
  });
});

describe('withFont', () => {
  it('puts one font everywhere and keeps the rest of the theme', () => {
    const themed = withFont(animeTheme, FONT_STACKS.openDyslexic, { displayWeight: 700 });
    expect(themed.vars['--ui-font-sans']).toBe(FONT_STACKS.openDyslexic);
    expect(themed.vars['--ui-font-display']).toBe(FONT_STACKS.openDyslexic);
    expect(themed.vars['--ui-font-display-weight']).toBe('700');
    expect(themed.style).toBe('anime');
    expect(themed.vars['--ui-brand-500']).toBe(animeTheme.vars['--ui-brand-500']);
    expect(animeTheme.vars['--ui-font-sans']).toBe(FONT_STACKS.mPlusRounded); // input not changed
  });

  it('works without a theme and can leave headings alone', () => {
    const themed = withFont(undefined, FONT_STACKS.system, { display: false });
    expect(themed.vars['--ui-font-sans']).toBe(FONT_STACKS.system);
    expect(themed.vars['--ui-font-display']).toBeUndefined();
  });

  it('createTheme accepts display fonts and a component style', () => {
    const theme = createTheme({ style: 'anime', tokens: { font: { display: 'Georgia, serif', displayWeight: 600 } } });
    expect(theme).toMatchObject({ style: 'anime', vars: { '--ui-font-display': 'Georgia, serif', '--ui-font-display-weight': '600' } });
  });

  it('names the same families the Fontsource packages register', () => {
    expect(FONT_STACKS.openDyslexic).toMatch(/^OpenDyslexic,/);
    expect(FONT_STACKS.mPlusRounded).toMatch(/^'M PLUS Rounded 1c',/);
    expect(FONT_STACKS.mochiyPopOne).toMatch(/^'Mochiy Pop One',/);
  });
});
