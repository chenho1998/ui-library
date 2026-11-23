# @yourorg/ui — component library

A themeable, accessible React component library: 45 components built on design tokens, with Radix UI handling focus,
keyboard and ARIA behaviour. Built to the *UI Component Library — Spec & Plan*.

| Package | What it is |
| --- | --- |
| `packages/tokens` → `@yourorg/tokens` | Token source (`src/tokens.json`), OKLCH palette generator, build to CSS variables + TS. The build **fails** if any text/background pair misses WCAG contrast. |
| `packages/ui` → `@yourorg/ui` | Components, `ThemeProvider`, `createTheme`, icons, `styles.css`. |
| `apps/storybook` | Storybook 10 playground and docs, with scheme, theme and font switchers in the toolbar. |

## Quick start

```bash
pnpm install
pnpm build            # tokens → ui (contrast checks + CSS budget run here)
pnpm lint             # ESLint (TypeScript, React hooks, jsx-a11y) and Stylelint
pnpm test             # 62 unit, interaction and axe accessibility tests
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

### Anime theme

One theme switch restyles every component; there is nothing else to import or wrap:

```tsx
import { ThemeProvider, animeTheme } from '@yourorg/ui';

<ThemeProvider theme={animeTheme}>…</ThemeProvider>
```

Hot-pink brand, cel-shaded buttons with a hard highlight band, 2.5 px ink outlines, chunky offset shadows that squash
on press, sparkles on hover and focus, screentone on ghost hover, wavy link underlines, and matching inputs, cards,
tabs, alerts, tables and overlays, in light and dark. Its CSS ships inside `styles.css` and only applies under this
theme. Headings use Mochiy Pop One and body text M PLUS Rounded 1c; install them in the app (below) or the theme falls
back to the platform's rounded fonts.

### Fonts

Any theme can use one font everywhere (except code):

```tsx
import { FONT_STACKS, withFont, animeTheme } from '@yourorg/ui';

<ThemeProvider theme={withFont(animeTheme, FONT_STACKS.openDyslexic, { displayWeight: 700 })}>…</ThemeProvider>
```

The library ships no font files. Load faces from Fontsource packages in the app, so nothing depends on a font CDN:

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
| Theme and icons | ThemeProvider, createTheme, animeTheme, withFont + FONT_STACKS, 20 icons + `createIcon` |
| Actions | Button, IconButton, ButtonGroup, Link |
| Forms | Field, TextField, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, NumberField, Combobox (single, multiple, async), DatePicker (+ Calendar) |
| Overlays | Dialog, AlertDialog, Drawer, Popover, Tooltip, DropdownMenu |
| Feedback | Alert, Toast (`toast()` + `<Toaster />`), Spinner, Progress, Skeleton |
| Navigation | Tabs, Breadcrumbs, Pagination |
| Data display | Card, Avatar, Badge, Tag, Accordion, Table, EmptyState |

## Measured today

| Check | Result |
| --- | --- |
| Tests | 62 passing, including axe on a page with every component, an open dialog and an open drawer |
| Lint | ESLint and Stylelint clean, run in CI |
| Contrast | 30 token pairs checked in light and dark, all pass; the anime theme passes the same pairs |
| Button | 2.5 KB gzip |
| TextField | 1.8 KB gzip |
| Dialog (incl. Radix focus trap and scroll lock) | 14.8 KB gzip |
| Typical page (Button, TextField, Dialog) | 16.4 KB gzip |
| `styles.css` (including the anime style) | 11.1 KB gzip |

## Known gaps (next steps)

- **Manual screen-reader passes** (NVDA, JAWS, VoiceOver, TalkBack) and the external audit are still to do; automated axe checks pass.
- **Chromatic** visual tests are not wired yet (a placeholder is in `ci.yml`).
- Icons ship inside `@yourorg/ui` for now rather than a separate `@yourorg/icons` package.
- Figma library and Code Connect are design-side work and not part of this repo.

## Releasing

Every PR that changes a package runs `pnpm changeset`. On `main`, the Changesets action opens a release PR; merging it
publishes both packages together and updates the changelog.
