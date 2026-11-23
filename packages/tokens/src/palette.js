// Palette generation in OKLCH so every step keeps an even perceived lightness.
// Used by the token build and by createTheme() at runtime.

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LIGHTNESS = [0.975, 0.945, 0.89, 0.815, 0.715, 0.625, 0.545, 0.475, 0.38, 0.285, 0.205];
const CHROMA = [0.12, 0.22, 0.42, 0.66, 0.86, 1, 1, 0.92, 0.8, 0.66, 0.52];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c: C, h: H };
}

function oklchToLinearRgb({ l: L, c: C, h: H }) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.0001 && v <= 1.0001);

export function oklchToHex(color) {
  let c = color.c;
  let rgb = oklchToLinearRgb({ ...color, c });
  // Reduce chroma until the colour fits in sRGB.
  while (!inGamut(rgb) && c > 0) {
    c = Math.max(0, c - 0.002);
    rgb = oklchToLinearRgb({ ...color, c });
  }
  return (
    '#' +
    rgb
      .map((v) => Math.round(clamp01(toGamma(clamp01(v))) * 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Generate an 11-step palette (50…950) from one base colour.
 * @param {string} hex base colour, e.g. '#3366ff'
 * @param {{ chroma?: number }} [opts] override the base chroma (use ~0.015 for neutrals)
 * @returns {Record<string, string>}
 */
export function generatePalette(hex, opts = {}) {
  const base = hexToOklch(hex);
  const chroma = opts.chroma ?? Math.max(base.c, 0.02);
  const out = {};
  STEPS.forEach((step, i) => {
    out[step] = oklchToHex({ l: LIGHTNESS[i], c: chroma * CHROMA[i], h: base.h });
  });
  return out;
}

/** WCAG 2 contrast ratio between two hex colours. */
export function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, bl] = hexToRgb(hex).map(toLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
