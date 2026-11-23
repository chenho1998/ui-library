---
'@yourorg/ui': minor
'@yourorg/tokens': minor
---

- Four more built-in themes, each restyling every component with one switch: `pixelTheme`, `brutalistTheme`,
  `sketchTheme` and `neonTheme`. All five themes now draw from shared style tokens (`components: { 'style-…' }`), so
  apps can make their own expressive theme with `createTheme({ style, components })`.
- New components: Sidebar (collapsible app menu with groups, badges and submenus), Stepper, Menubar, ContextMenu,
  Collapsible, SegmentedControl, ToggleGroup, PinInput, FileUpload, Rating, TimePicker, DateRangePicker,
  CommandPalette (Cmd+K), HoverCard, Kbd, ScrollArea, Timeline, TreeView, Stat and DescriptionList. Calendar gains a
  `range` mode.
- Twelve more icons (Home, Settings, Users, Folder, File, Chart, Bell, Clock, Upload, Star, Menu, PanelLeft).
- `FONT_STACKS` adds Silkscreen, Pixelify Sans, Space Grotesk, Patrick Hand, Orbitron and Exo 2.
- Size budgets: styles.css 12 → 16 KB and the whole library 70 → 90 KB (single-component imports are unchanged).
