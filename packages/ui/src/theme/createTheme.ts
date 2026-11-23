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
    font?: { sans?: string; mono?: string };
  };
  /** Semantic colour overrides per colour scheme, e.g. `{ light: { bg: '#fafafa' } }`. */
  colors?: { light?: Scale; dark?: Scale };
  /** Component token overrides, e.g. `{ 'button-radius': '999px' }`. */
  components?: Scale;
}

export interface Theme {
  /** CSS variables applied for every colour scheme. */
  vars: Record<string, string>;
  /** CSS variables applied only for the resolved light or dark scheme. */
  schemes: { light: Record<string, string>; dark: Record<string, string> };
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
  if (tokens.font?.sans) vars[v('font-sans')] = tokens.font.sans;
  if (tokens.font?.mono) vars[v('font-mono')] = tokens.font.mono;
  for (const [k, val] of Object.entries(options.components ?? {})) vars[v(k)] = val;

  const scheme = (map?: Scale) =>
    Object.fromEntries(Object.entries(map ?? {}).map(([k, val]) => [v(`color-${k}`), val]));
  return { vars, schemes: { light: scheme(options.colors?.light), dark: scheme(options.colors?.dark) } };
}
