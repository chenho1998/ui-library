---
'@yourorg/ui': minor
'@yourorg/icons': minor
'@yourorg/tokens': patch
---

- **New `@yourorg/icons` package**: extracted 40 tree-shakeable SVG icons and `createIcon` into a standalone package (`sideEffects: false`), re-exported by name from `@yourorg/ui` to preserve full single-component tree-shaking.
- **Five new components**: `DataTable` (sorting, search filtering, selection, bulk actions and pagination), `Carousel` (controls, dots, swipe, keyboard and reduced-motion-aware auto-play), `ColorPicker` (2D HSV area, hue slider, hex input and preset swatches), `Resizable` (split panes with pointer drag and WAI-ARIA window-splitter keyboard controls) and `Banner` (full-width subtle/solid announcement bar).
- **Smaller bundles**: replaced Radix wrappers for `ScrollArea`, `Avatar` and `Progress` with native accessible implementations, minified `dist/styles.css` with esbuild (14.6 → 13.4 KB gzip even after 5 new components), deduplicated `DropdownMenu` onto the shared menu builder (adding `Sub`/`SubTrigger`/`SubContent`) and split internal locale overrides.
- **Existing component improvements**: added `useControllableState` and forwarded refs across `PinInput`, `FileUpload`, `Rating`, `Calendar`, `TreeView`, `Timeline.Item`, `DescriptionList.Item`, `Dialog.Body`/`Footer` and `Sidebar.Group`/`Submenu`; exposed controlled `open` on `Combobox`, `DatePicker`, `TimePicker` and `DateRangePicker`; added `toast.info()`, `toast.warning()`, `toast.promise()`, uncontrolled `Pagination`, `Rating` `allowClear`, `Stepper` `allowClickAll` & custom `icon`, `Tooltip` `disabled`, `TreeView` `*` expand & type-ahead, keyboard-activatable `Table` rows, and edge-case fixes in `Button`, `NumberField`, `AlertDialog` and `CommandPalette`.
- **Tooling & docs**: pinned TypeScript `~6.0.3`, added `.nvmrc` (Node 22), updated GitHub Actions majors, added Playwright visual regression suite (`pnpm test:visual`) + optional Chromatic step in CI, and added Usage Guidelines, Migration Guide and interactive Storybook playgrounds.
