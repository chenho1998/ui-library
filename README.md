# @yourorg/ui — component library

[![Live Storybook](https://img.shields.io/badge/Storybook-Live%20Preview-2c5df5?logo=storybook&logoColor=white)](https://chenho1998.github.io/ui-library/)

A themeable, accessible React component library: **50 components** and **40 icons** built on design tokens, with Radix UI
handling complex overlay, focus, keyboard and ARIA behaviour.

> **Live preview:** [chenho1998.github.io/ui-library](https://chenho1998.github.io/ui-library/) ·
> [Themes gallery](https://chenho1998.github.io/ui-library/?path=/story/getting-started-themes--gallery) ·
> [Design tokens](https://chenho1998.github.io/ui-library/?path=/docs/foundations-design-tokens--docs) ·
> [Icons](https://chenho1998.github.io/ui-library/?path=/docs/foundations-icons--docs) ·
> [App shell](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard) ·
> [Usage guidelines](https://chenho1998.github.io/ui-library/?path=/docs/getting-started-usage-guidelines--docs) ·
> [Migration guide](https://chenho1998.github.io/ui-library/?path=/docs/getting-started-migration-guide--docs)

| Package | What it is |
| --- | --- |
| `packages/tokens` → `@yourorg/tokens` | Token source (`src/tokens.json`), OKLCH palette generator, build to CSS variables + TS. The build **fails** if any text/background pair misses WCAG contrast. ([Design tokens](https://chenho1998.github.io/ui-library/?path=/docs/foundations-design-tokens--docs)) |
| `packages/icons` → `@yourorg/icons` | Standalone, tree-shakeable 40-icon SVG set and `createIcon` helper (`sideEffects: false`), also re-exported by name from `@yourorg/ui`. ([Icons preview](https://chenho1998.github.io/ui-library/?path=/docs/foundations-icons--docs)) |
| `packages/ui` → `@yourorg/ui` | Components, `ThemeProvider`, `createTheme`, `useControllableState`, `styles.css`. |
| `apps/storybook` → `@yourorg/storybook` | Storybook 10 docs site: branded sidebar, usage guidelines, migration guide, interactive playgrounds, scheme/theme/font switchers, and Playwright visual regression suite. ([Live site](https://chenho1998.github.io/ui-library/)) |

## Quick start

Requires Node 22+ (see `.nvmrc`).

```bash
pnpm install
pnpm build            # tokens → icons → ui (contrast checks + minified CSS budget run here)
pnpm lint             # ESLint (TypeScript, React hooks, jsx-a11y) and Stylelint
pnpm typecheck        # tsc across @yourorg/icons and @yourorg/ui
pnpm test             # 114 unit, interaction and axe accessibility tests
pnpm size             # bundle-size budgets
pnpm storybook        # http://localhost:6006
pnpm build-storybook  # static build in apps/storybook/storybook-static
pnpm test:visual      # Playwright visual regression against built Storybook
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

One theme switch restyles every component, in light and dark; there is nothing else to import or wrap ([compare all side by side](https://chenho1998.github.io/ui-library/?path=/story/getting-started-themes--gallery)):

```tsx
import { ThemeProvider, pixelTheme } from '@yourorg/ui';

<ThemeProvider theme={pixelTheme}>…</ThemeProvider>
```

| Theme | Look | Fonts (Fontsource package) | Preview |
| --- | --- | --- | --- |
| `animeTheme` | Hot pink, cel-shaded buttons, 2.5 px ink outlines, squashy offset shadows, sparkles, screentone, wavy links | Mochiy Pop One, M PLUS Rounded 1c | [Light](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:anime;scheme:light) · [Dark](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:anime;scheme:dark) |
| `pixelTheme` | 8-bit: square notched outlines, bevelled buttons, checker hover, dithered backdrop | Silkscreen, Pixelify Sans | [Light](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:pixel;scheme:light) · [Dark](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:pixel;scheme:dark) |
| `brutalistTheme` | Thick black borders, flat yellow, big hard shadows, square corners, uppercase buttons | Space Grotesk | [Light](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:brutalist;scheme:light) · [Dark](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:brutalist;scheme:dark) |
| `sketchTheme` | Wobbly pencil outlines, handwriting, hatched hover, notebook lines; a chalkboard in dark mode | Patrick Hand | [Light](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:sketch;scheme:light) · [Dark](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:sketch;scheme:dark) |
| `neonTheme` | Synthwave: glowing magenta and cyan outlines, grid background; best in dark mode | Orbitron, Exo 2 | [Light](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:neon;scheme:light) · [Dark](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard&globals=theme:neon;scheme:dark) |

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

Library CSS sits in `@layer ui.reset, ui.tokens, ui.components`, so any ordinary app CSS overrides it without `!important`.
Overlays portal into the `ThemeProvider` root, so dialogs and menus inherit the theme (including nested themes).

## Components

| Category | Components | Preview |
| --- | --- | --- |
| Foundations | Design tokens (`@yourorg/tokens`), `ThemeProvider`, `createTheme`, `withFont`, 5 built-in themes, `@yourorg/icons` (40 icons + `createIcon`) | [Design tokens](https://chenho1998.github.io/ui-library/?path=/docs/foundations-design-tokens--docs) · [Icons](https://chenho1998.github.io/ui-library/?path=/docs/foundations-icons--docs) · [Themes](https://chenho1998.github.io/ui-library/?path=/story/getting-started-themes--gallery) |
| Inputs & Actions | [Button](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-button--docs), IconButton, ButtonGroup, Link, Field, TextField, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, NumberField, Combobox (single, multiple, async), DatePicker (+ Calendar), DateRangePicker, TimePicker, [ColorPicker](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-colorpicker--docs), [SegmentedControl](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-segmentedcontrol--docs), ToggleGroup, [PinInput](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-pininput--docs), [FileUpload](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-fileupload--docs), [Rating](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-rating--docs) | [Button](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-button--docs) · [Text & Forms](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-text-forms--docs) · [Pickers](https://chenho1998.github.io/ui-library/?path=/docs/inputs-actions-date-time-pickers--docs) |
| Data Display | [DataTable](https://chenho1998.github.io/ui-library/?path=/docs/data-display-datatable--docs), [Carousel](https://chenho1998.github.io/ui-library/?path=/docs/data-display-carousel--docs), Card, Avatar, Badge, Tag, Accordion, Table, EmptyState, [Timeline](https://chenho1998.github.io/ui-library/?path=/docs/data-display-timeline--docs), [TreeView](https://chenho1998.github.io/ui-library/?path=/docs/data-display-treeview--docs), [Stat](https://chenho1998.github.io/ui-library/?path=/docs/data-display-stat--docs), [DescriptionList](https://chenho1998.github.io/ui-library/?path=/docs/data-display-descriptionlist--docs) | [DataTable](https://chenho1998.github.io/ui-library/?path=/docs/data-display-datatable--docs) · [Carousel](https://chenho1998.github.io/ui-library/?path=/docs/data-display-carousel--docs) · [Tables & Cards](https://chenho1998.github.io/ui-library/?path=/docs/data-display-tables-cards--docs) |
| Feedback | [Banner](https://chenho1998.github.io/ui-library/?path=/docs/feedback-banner--docs), Alert, Toast (`toast()` + `.info`/`.success`/`.warning`/`.error`/`.promise` + `<Toaster />`), Spinner, Progress, Skeleton | [Banner](https://chenho1998.github.io/ui-library/?path=/docs/feedback-banner--docs) · [Alerts & Toasts](https://chenho1998.github.io/ui-library/?path=/docs/feedback-alerts-toasts--docs) |
| Navigation & Layout | [Resizable](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-resizable--docs), [Sidebar](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-sidebar--docs), [Stepper](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-stepper--docs), [Menus](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-menus--docs) (Menubar & ContextMenu), [Tabs & Pagination](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-tabs-pagination--docs) (+ Breadcrumbs), [Collapsible](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-collapsible--docs), Box, Stack, Grid, Container, Divider | [Resizable](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-resizable--docs) · [Sidebar](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-sidebar--docs) · [Tabs & Pagination](https://chenho1998.github.io/ui-library/?path=/docs/navigation-layout-tabs-pagination--docs) |
| Overlays & Utilities | [CommandPalette](https://chenho1998.github.io/ui-library/?path=/docs/overlays-utilities-commandpalette--docs) (Cmd+K), Dialog, AlertDialog, Drawer, Popover, Tooltip, DropdownMenu (with submenus), [HoverCard](https://chenho1998.github.io/ui-library/?path=/docs/overlays-utilities-hovercard--docs), [Kbd & ScrollArea](https://chenho1998.github.io/ui-library/?path=/docs/overlays-utilities-kbd-scrollarea--docs), `useControllableState` | [CommandPalette](https://chenho1998.github.io/ui-library/?path=/docs/overlays-utilities-commandpalette--docs) · [Dialogs & Drawers](https://chenho1998.github.io/ui-library/?path=/docs/overlays-utilities-dialogs-drawers--docs) |
| Templates | App Shell (Sidebar + Banner + CommandPalette + Stats + Stepper + Timeline), Settings Page | [App Shell](https://chenho1998.github.io/ui-library/?path=/story/templates-app-shell--dashboard) · [Settings Page](https://chenho1998.github.io/ui-library/?path=/story/templates-settings-page--settings-page) |

## Measured today

| Check | Result |
| --- | --- |
| Tests | 114 passing, including axe across all 50 components, open dialogs and drawers |
| Visual tests | 16 Playwright visual regression cases across light, dark and expressive themes (plus optional Chromatic in CI) |
| Lint | ESLint and Stylelint clean, run in CI |
| Contrast | 30 token pairs checked in light and dark, all pass; all five built-in themes pass the same pairs |
| Button | 2.5 KB gzip (budget 3 KB) |
| TextField | 1.6 KB gzip (budget 4 KB) |
| Dialog (incl. Radix focus trap and scroll lock) | 14.6 KB gzip (budget 15 KB) |
| Typical page (Button, TextField, Dialog, ThemeProvider) | 16.6 KB gzip (budget 30 KB) |
| Everything | 86.3 KB gzip (budget 90 KB) |
| `styles.css` (minified, all 50 components and 5 themes) | 13.4 KB gzip (budget 16 KB) |

## Known gaps (next steps)

- **Manual screen-reader passes** (NVDA, JAWS, VoiceOver, TalkBack) and an external accessibility audit are still to do; automated axe checks pass.
- **Chromatic** is wired in `ci.yml` (`chromaui/action@v18`) and activates automatically once a `CHROMATIC_PROJECT_TOKEN` repository secret is added.
- Figma library and Code Connect are design-side work and not part of this repo.

## Releasing

Every PR that changes a package runs `pnpm changeset`. On `main`, the Changesets action opens a release PR; merging it
publishes `@yourorg/tokens`, `@yourorg/icons`, and `@yourorg/ui` together and updates their changelogs.
