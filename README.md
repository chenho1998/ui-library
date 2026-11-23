# @yourorg/ui — component library

A themeable, accessible React component library: 45 components built on design tokens, with Radix UI handling focus,
keyboard and ARIA behaviour. Built to the *UI Component Library — Spec & Plan*.

| Package | What it is |
| --- | --- |
| `packages/tokens` → `@yourorg/tokens` | Token source (`src/tokens.json`), OKLCH palette generator, build to CSS variables + TS. The build **fails** if any text/background pair misses WCAG contrast. |
| `packages/ui` → `@yourorg/ui` | Components, `ThemeProvider`, `createTheme`, icons, `styles.css`. |
| `apps/storybook` | Storybook 10 playground and docs, with light/dark/system and brand switchers in the toolbar. |

## Quick start

```bash
pnpm install
pnpm build            # tokens → ui (contrast checks + CSS budget run here)
pnpm test             # 32 unit, interaction and axe accessibility tests
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

Library CSS sits in `@layer ui.tokens, ui.components`, so any ordinary app CSS overrides it without `!important`.
Overlays portal into the `ThemeProvider` root, so dialogs and menus inherit the theme (including nested themes).

## Components

| Group | Components |
| --- | --- |
| Layout and type | Box, Stack, Grid, Container, Divider, Text, Heading, VisuallyHidden |
| Theme and icons | ThemeProvider, createTheme, 20 icons + `createIcon` |
| Actions | Button, IconButton, ButtonGroup, Link |
| Forms | Field, TextField, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, NumberField, Combobox, DatePicker (+ Calendar) |
| Overlays | Dialog, AlertDialog, Drawer, Popover, Tooltip, DropdownMenu |
| Feedback | Alert, Toast (`toast()` + `<Toaster />`), Spinner, Progress, Skeleton |
| Navigation | Tabs, Breadcrumbs, Pagination |
| Data display | Card, Avatar, Badge, Tag, Accordion, Table, EmptyState |

## Measured today

| Check | Result |
| --- | --- |
| Tests | 32 passing, including axe on a page with every component and on an open dialog |
| Contrast | 30 token pairs checked in light and dark, all pass |
| Button | 2.4 KB gzip |
| TextField | 1.8 KB gzip |
| Dialog (incl. Radix focus trap and scroll lock) | 14.8 KB gzip |
| Typical page (Button, TextField, Dialog) | 16.3 KB gzip |
| `styles.css` | 9.4 KB gzip |

## Known gaps (next steps)

- **Manual screen-reader passes** (NVDA, JAWS, VoiceOver, TalkBack) and the external audit are still to do; automated axe checks pass.
- **ESLint/Stylelint** config and **Chromatic** visual tests are not wired yet (a placeholder is in `ci.yml`).
- Icons ship inside `@yourorg/ui` for now rather than a separate `@yourorg/icons` package.
- Combobox is single-select; multi-select and async loading states are backlog items.
- Toast swipe-to-dismiss is basic (horizontal drag over 80 px).
- Figma library and Code Connect are design-side work and not part of this repo.

## Releasing

Every PR that changes a package runs `pnpm changeset`. On `main`, the Changesets action opens a release PR; merging it
publishes both packages together and updates the changelog.
