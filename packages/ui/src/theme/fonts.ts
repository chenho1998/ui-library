// Font stacks. Each is a plain constant (themes import these, not FONT_STACKS.x reads) so the built-in themes stay
// tree-shakable: bundlers treat a property read as a possible side effect and would keep every theme in every bundle.
// The library ships no font files: install a face in your app (the Fontsource package is named per stack) and import it once.

export const INTER = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const SYSTEM = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const OPEN_DYSLEXIC = "OpenDyslexic, 'Comic Sans MS', ui-sans-serif, system-ui, sans-serif";
export const M_PLUS_ROUNDED = "'M PLUS Rounded 1c', ui-rounded, 'Hiragino Maru Gothic ProN', ui-sans-serif, system-ui, sans-serif";
export const MOCHIY_POP_ONE = "'Mochiy Pop One', 'M PLUS Rounded 1c', ui-rounded, ui-sans-serif, system-ui, sans-serif";
export const SILKSCREEN = "Silkscreen, 'Pixelify Sans', ui-monospace, monospace";
export const PIXELIFY_SANS = "'Pixelify Sans', ui-monospace, SFMono-Regular, Menlo, monospace";
export const SPACE_GROTESK = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
export const PATRICK_HAND = "'Patrick Hand', 'Comic Sans MS', 'Segoe Print', ui-rounded, cursive";
export const ORBITRON = "Orbitron, 'Exo 2', ui-sans-serif, system-ui, sans-serif";
export const EXO_2 = "'Exo 2', ui-sans-serif, system-ui, sans-serif";

/** Font stacks for `withFont()` and `createTheme({ tokens: { font } })`. */
export const FONT_STACKS = {
  /** The default: Inter, then the platform UI font. Package: `@fontsource/inter`. */
  inter: INTER,
  /** No web font at all. */
  system: SYSTEM,
  /** Dyslexia-friendly face (SIL Open Font License). Package: `@fontsource/opendyslexic`. */
  openDyslexic: OPEN_DYSLEXIC,
  /** Anime body. Package: `@fontsource/m-plus-rounded-1c`. */
  mPlusRounded: M_PLUS_ROUNDED,
  /** Anime headings (one weight, 400). Package: `@fontsource/mochiy-pop-one`. */
  mochiyPopOne: MOCHIY_POP_ONE,
  /** Pixel headings. Package: `@fontsource/silkscreen`. */
  silkscreen: SILKSCREEN,
  /** Pixel body. Package: `@fontsource/pixelify-sans`. */
  pixelifySans: PIXELIFY_SANS,
  /** Brutalist headings and body. Package: `@fontsource/space-grotesk`. */
  spaceGrotesk: SPACE_GROTESK,
  /** Sketch headings and body (one weight, 400). Package: `@fontsource/patrick-hand`. */
  patrickHand: PATRICK_HAND,
  /** Neon headings. Package: `@fontsource/orbitron`. */
  orbitron: ORBITRON,
  /** Neon body. Package: `@fontsource/exo-2`. */
  exo2: EXO_2,
} as const;
