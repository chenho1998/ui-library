import { generatePalette } from '@yourorg/tokens';

type Scale = Record<string, string>;

export interface ThemeOptions {
  /** One brand colour; the full 50–950 palette and the accent tokens are generated from it. */
  brand?: string;
  /** Global token overrides, e.g. `{ radius: { md: '6px' }, font: { sans: 'Geist, system-ui' } }`. */
  tokens?: {
    radius?: Scale;
    space?: Scale;
    shadow?: Scale;
    /** `display` is used for headings and titles; it falls back to `sans`. */
    font?: { sans?: string; mono?: string; display?: string; displayWeight?: number | string };
  };
  /** Semantic colour overrides per colour scheme, e.g. `{ light: { bg: '#fafafa' } }`. */
  colors?: { light?: Scale; dark?: Scale };
  /** Component token overrides, e.g. `{ 'button-radius': '999px' }`. */
  components?: Scale;
  /** Opt-in component style shipped in styles.css, e.g. `'anime'`. Default: the standard style. */
  style?: string;
}

export interface Theme {
  /** CSS variables applied for every colour scheme. */
  vars: Record<string, string>;
  /** CSS variables applied only for the resolved light or dark scheme. */
  schemes: { light: Record<string, string>; dark: Record<string, string> };
  /** Component style name, set on the theme root as `data-ui-style`. */
  style?: string;
}

const v = (name: string) => `--ui-${name}`;

/**
 * Build a theme object for `<ThemeProvider theme={…}>`.
 *
 * ```ts
 * const acme = createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px' } } });
 * ```
 */
export function createTheme(options: ThemeOptions = {}): Theme {
  const vars: Record<string, string> = {};
  if (options.brand) {
    const palette = generatePalette(options.brand);
    for (const [step, hex] of Object.entries(palette)) vars[v(`brand-${step}`)] = hex;
  }
  const { tokens = {} } = options;
  for (const group of ['radius', 'space', 'shadow'] as const) {
    for (const [k, val] of Object.entries(tokens[group] ?? {})) vars[v(`${group}-${k}`)] = val;
  }
  const font = tokens.font ?? {};
  if (font.sans) vars[v('font-sans')] = font.sans;
  if (font.mono) vars[v('font-mono')] = font.mono;
  if (font.display) vars[v('font-display')] = font.display;
  if (font.displayWeight !== undefined) vars[v('font-display-weight')] = String(font.displayWeight);
  for (const [k, val] of Object.entries(options.components ?? {})) vars[v(k)] = val;

  const scheme = (map?: Scale) =>
    Object.fromEntries(Object.entries(map ?? {}).map(([k, val]) => [v(`color-${k}`), val]));
  const theme: Theme = { vars, schemes: { light: scheme(options.colors?.light), dark: scheme(options.colors?.dark) } };
  if (options.style) theme.style = options.style;
  return theme;
}

export interface WithFontOptions {
  /** Also use the font for headings and titles. Default `true`. */
  display?: boolean;
  /** Weight for headings and titles in this font, e.g. 700. Default: the theme's. */
  displayWeight?: number;
}

/**
 * Returns a copy of `theme` (or the default theme) that uses one font everywhere except code.
 *
 * ```ts
 * <ThemeProvider theme={withFont(acme, FONT_STACKS.openDyslexic, { displayWeight: 700 })}>
 * ```
 */
export function withFont(theme: Theme | undefined, stack: string, options: WithFontOptions = {}): Theme {
  const base = theme ?? createTheme();
  const vars = { ...base.vars, [v('font-sans')]: stack };
  if (options.display !== false) vars[v('font-display')] = stack;
  if (options.displayWeight !== undefined) vars[v('font-display-weight')] = String(options.displayWeight);
  return { ...base, vars };
}
