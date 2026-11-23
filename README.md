# @yourorg/ui — component library

A themeable, accessible React component library: 45 components built on design tokens, with Radix UI handling focus,
keyboard and ARIA behaviour. Built to the *UI Component Library — Spec & Plan*.

| Package | What it is |
| --- | --- |
| `packages/tokens` → `@yourorg/tokens` | Token source (`src/tokens.json`), OKLCH palette generator, build to CSS variables + TS. The build **fails** if any text/background pair misses WCAG contrast. |
| `packages/ui` → `@yourorg/ui` | Components, `ThemeProvider`, `createTheme`, icons, `styles.css`. |
| `apps/storybook` | Storybook 10 docs site: branded sidebar grouped Get started → Foundations → Components → Patterns, "New" badges, and scheme, theme and font switchers. |

## Quick start

```bash
pnpm install
pnpm build            # tokens → ui (contrast checks + CSS budget run here)
pnpm lint             # ESLint (TypeScript, React hooks, jsx-a11y) and Stylelint
pnpm test             # 92 unit, interaction and axe accessibility tests
pnpm size             # bundle-size budgets
pnpm storybook        # http://localhost:6006
```

## Using it in an app

```tsx
import '@yourorg/ui/styles.css';
import { ThemeProvider, Toaster, Button, TextField, toast } from '@yourorg/ui';

export function App() {
  return (
    <ThemeProvider defaultColorScheme="system" storageKey="color-scheme">
      <TextField label="Email" type="email" required />
      <Button onClick={() => toast.success('Saved')}>Save</Button>
      <Toaster />
    </ThemeProvider>
  );
}
```

To avoid a flash of the wrong theme, put `getThemeScript('color-scheme')` in an inline `<script>` in the document head.

## Theming

```tsx
const acme = createTheme({
  brand: '#7c3aed',                         // whole brand palette generated in OKLCH
  tokens: { radius: { md: '6px' } },        // global token overrides
  colors: { dark: { bg: '#0b0b10' } },      // per-scheme semantic overrides
  components: { 'button-radius': '999px' }, // component tokens
});
<ThemeProvider theme={acme}>…</ThemeProvider>
```

### Built-in themes

One theme switch restyles every component, in light and dark; there is nothing else to import or wrap:

```tsx
import { ThemeProvider, pixelTheme } from '@yourorg/ui';

<ThemeProvider theme={pixelTheme}>…</ThemeProvider>
```

| Theme | Look | Fonts (Fontsource package) |
| --- | --- | --- |
| `animeTheme` | Hot pink, cel-shaded buttons, 2.5 px ink outlines, squashy offset shadows, sparkles, screentone, wavy links | Mochiy Pop One, M PLUS Rounded 1c |
| `pixelTheme` | 8-bit: square notched outlines, bevelled buttons, checker hover, dithered backdrop | Silkscreen, Pixelify Sans |
| `brutalistTheme` | Thick black borders, flat yellow, big hard shadows, square corners, uppercase buttons | Space Grotesk |
| `sketchTheme` | Wobbly pencil outlines, handwriting, hatched hover, notebook lines; a chalkboard in dark mode | Patrick Hand |
| `neonTheme` | Synthwave: glowing magenta and cyan outlines, grid background; best in dark mode | Orbitron, Exo 2 |

Every theme passes the same contrast checks as the default theme (tested). Their CSS ships inside `styles.css` and only
applies under that theme. Without the fonts installed, each theme falls back to similar system fonts.

### Style tokens (make your own expressive theme)

The built-in themes are plain `createTheme()` calls: a `style` name plus style tokens, read by one shared stylesheet.

```tsx
const comic = createTheme({
  brand: '#ff5a1f',
  style: 'comic', // any name turns the expressive styles on
  components: {
    'style-border-width': '3px',                  // outlines on controls and surfaces
    'style-offset': '4px',                        // hard offset shadow (use style-blur for glows)
    'style-press': 'translate(3px, 3px)',         // how buttons move when pressed
    'style-hover-fill': 'radial-gradient(currentcolor 1px, transparent 1.5px)', // ghost hover texture
    'style-link-line': 'wavy',
  },
  colors: { light: { 'style-ink': '#111', 'style-shadow': '#111' }, dark: { 'style-ink': '#fff', 'style-shadow': '#ff5a1f' } },
});
```

Other tokens: `style-blur`, `style-raise`, `style-button-fill`, `style-button-weight`, `style-button-case`,
`style-heading-shadow`, `style-divider`, `style-bar-fill`, `style-backdrop`, `style-page` (each with `-size` where it is a
background).

### Fonts

Any theme can use one font everywhere (except code):

```tsx
import { FONT_STACKS, withFont, animeTheme } from '@yourorg/ui';

<ThemeProvider theme={withFont(animeTheme, FONT_STACKS.openDyslexic, { displayWeight: 700 })}>…</ThemeProvider>
```

The library ships no font files. Load the faces a theme uses from Fontsource packages, so nothing depends on a font CDN:

```ts
import '@fontsource/opendyslexic/400.css';       // FONT_STACKS.openDyslexic (also 700.css)
import '@fontsource/m-plus-rounded-1c/400.css';  // anime body (also 500.css, 700.css)
import '@fontsource/mochiy-pop-one/400.css';     // anime headings
```

Library CSS sits in `@layer ui.tokens, ui.components`, so any ordinary app CSS overrides it without `!important`.
Overlays portal into the `ThemeProvider` root, so dialogs and menus inherit the theme (including nested themes).

## Components

| Group | Components |
| --- | --- |
| Layout and type | Box, Stack, Grid, Container, Divider, Text, Heading, VisuallyHidden |
| Theme and icons | ThemeProvider, createTheme, withFont + FONT_STACKS, animeTheme, pixelTheme, brutalistTheme, sketchTheme, neonTheme, 32 icons + `createIcon` |
| Actions | Button, IconButton, ButtonGroup, Link |
| Forms | Field, TextField, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, NumberField, Combobox (single, multiple, async), DatePicker (+ Calendar), DateRangePicker, TimePicker, SegmentedControl, ToggleGroup, PinInput, FileUpload, Rating |
| Overlays | Dialog, AlertDialog, Drawer, Popover, Tooltip, DropdownMenu, ContextMenu, CommandPalette (Cmd+K), HoverCard |
| Feedback | Alert, Toast (`toast()` + `<Toaster />`), Spinner, Progress, Skeleton |
| Navigation | Sidebar (collapsible app menu), Tabs, Breadcrumbs, Pagination, Stepper, Menubar, Collapsible |
| Data display | Card, Avatar, Badge, Tag, Accordion, Table, EmptyState, Timeline, TreeView, Stat, DescriptionList |
| Utilities | Kbd, ScrollArea |

## Measured today

| Check | Result |
| --- | --- |
| Tests | 92 passing, including axe on a page with every component, the new components, an open dialog and an open drawer |
| Lint | ESLint and Stylelint clean, run in CI |
| Contrast | 30 token pairs checked in light and dark, all pass; all five built-in themes pass the same pairs |
| Button | 2.5 KB gzip |
| TextField | 1.8 KB gzip |
| Dialog (incl. Radix focus trap and scroll lock) | 14.8 KB gzip |
| Typical page (Button, TextField, Dialog) | 16.4 KB gzip |
| Everything | 84.6 KB gzip (budget raised from 70 to 90 KB for the new components) |
| `styles.css` (all components and themes) | 14.6 KB gzip (budget raised from 12 to 16 KB) |

## Known gaps (next steps)

- **Manual screen-reader passes** (NVDA, JAWS, VoiceOver, TalkBack) and the external audit are still to do; automated axe checks pass.
- **Chromatic** visual tests are not wired yet (a placeholder is in `ci.yml`).
- Icons ship inside `@yourorg/ui` for now rather than a separate `@yourorg/icons` package.
- Figma library and Code Connect are design-side work and not part of this repo.

## Releasing

Every PR that changes a package runs `pnpm changeset`. On `main`, the Changesets action opens a release PR; merging it
publishes both packages together and updates the changelog.
