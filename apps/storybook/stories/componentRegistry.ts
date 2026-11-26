export interface ComponentToken {
  name: string;
  kind: 'color' | 'radius' | 'shadow' | 'size';
  role: string;
}

export interface KeyboardShortcut {
  keys: string[];
  action: string;
}

export interface ComponentDocMeta {
  packageName: '@yourorg/ui' | '@yourorg/icons' | '@yourorg/tokens';
  version: string;
  since: 'v0.1' | 'v0.2' | 'v0.3';
  sourcePath: string;
  cssPath?: string;
  imports: string[];
  summary: string;
  aria?: string;
  keyboard?: KeyboardShortcut[];
  tokens: ComponentToken[];
  themeSnippet?: string;
}

export interface NavEntry {
  title: string;
  category: string;
  label: string;
  href: string;
}

export const REPO_URL = 'https://github.com/chenho1998/ui-library';
export const CURRENT_VERSION = 'v0.3.0';

export function githubBlobUrl(filePath: string) {
  return `${REPO_URL}/blob/main/${filePath}`;
}

export function githubHistoryUrl(filePath: string) {
  return `${REPO_URL}/commits/main/${filePath}`;
}

/** Exact sidebar order used for MUI-style Previous / Next page navigation. */
export const NAV_ORDER: NavEntry[] = [
  { title: 'Getting Started/Introduction', category: 'Getting Started', label: 'Introduction', href: '?path=/docs/getting-started-introduction--docs' },
  { title: 'Getting Started/Usage guidelines', category: 'Getting Started', label: 'Usage guidelines', href: '?path=/docs/getting-started-usage-guidelines--docs' },
  { title: 'Getting Started/Themes', category: 'Getting Started', label: 'Themes', href: '?path=/story/getting-started-themes--gallery' },
  { title: 'Getting Started/Migration guide', category: 'Getting Started', label: 'Migration guide', href: '?path=/docs/getting-started-migration-guide--docs' },
  { title: 'Foundations/Design tokens', category: 'Foundations', label: 'Design tokens', href: '?path=/docs/foundations-design-tokens--docs' },
  { title: 'Foundations/Icons', category: 'Foundations', label: 'Icons', href: '?path=/docs/foundations-icons--docs' },
  { title: 'Inputs & Actions/Button', category: 'Inputs & Actions', label: 'Button', href: '?path=/docs/inputs-actions-button--docs' },
  { title: 'Inputs & Actions/Text & Forms', category: 'Inputs & Actions', label: 'Text & Forms', href: '?path=/docs/inputs-actions-text-forms--docs' },
  { title: 'Inputs & Actions/ColorPicker', category: 'Inputs & Actions', label: 'ColorPicker', href: '?path=/docs/inputs-actions-colorpicker--docs' },
  { title: 'Inputs & Actions/Date & Time Pickers', category: 'Inputs & Actions', label: 'Date & Time Pickers', href: '?path=/docs/inputs-actions-date-time-pickers--docs' },
  { title: 'Inputs & Actions/FileUpload', category: 'Inputs & Actions', label: 'FileUpload', href: '?path=/docs/inputs-actions-fileupload--docs' },
  { title: 'Inputs & Actions/PinInput', category: 'Inputs & Actions', label: 'PinInput', href: '?path=/docs/inputs-actions-pininput--docs' },
  { title: 'Inputs & Actions/Rating', category: 'Inputs & Actions', label: 'Rating', href: '?path=/docs/inputs-actions-rating--docs' },
  { title: 'Inputs & Actions/SegmentedControl', category: 'Inputs & Actions', label: 'SegmentedControl', href: '?path=/docs/inputs-actions-segmentedcontrol--docs' },
  { title: 'Data Display/DataTable', category: 'Data Display', label: 'DataTable', href: '?path=/docs/data-display-datatable--docs' },
  { title: 'Data Display/Carousel', category: 'Data Display', label: 'Carousel', href: '?path=/docs/data-display-carousel--docs' },
  { title: 'Data Display/Tables & Cards', category: 'Data Display', label: 'Tables & Cards', href: '?path=/docs/data-display-tables-cards--docs' },
  { title: 'Data Display/DescriptionList', category: 'Data Display', label: 'DescriptionList', href: '?path=/docs/data-display-descriptionlist--docs' },
  { title: 'Data Display/Stat', category: 'Data Display', label: 'Stat', href: '?path=/docs/data-display-stat--docs' },
  { title: 'Data Display/Timeline', category: 'Data Display', label: 'Timeline', href: '?path=/docs/data-display-timeline--docs' },
  { title: 'Data Display/TreeView', category: 'Data Display', label: 'TreeView', href: '?path=/docs/data-display-treeview--docs' },
  { title: 'Feedback/Banner', category: 'Feedback', label: 'Banner', href: '?path=/docs/feedback-banner--docs' },
  { title: 'Feedback/Alerts & Toasts', category: 'Feedback', label: 'Alerts & Toasts', href: '?path=/docs/feedback-alerts-toasts--docs' },
  { title: 'Navigation & Layout/Resizable', category: 'Navigation & Layout', label: 'Resizable', href: '?path=/docs/navigation-layout-resizable--docs' },
  { title: 'Navigation & Layout/Sidebar', category: 'Navigation & Layout', label: 'Sidebar', href: '?path=/docs/navigation-layout-sidebar--docs' },
  { title: 'Navigation & Layout/Stepper', category: 'Navigation & Layout', label: 'Stepper', href: '?path=/docs/navigation-layout-stepper--docs' },
  { title: 'Navigation & Layout/Menus', category: 'Navigation & Layout', label: 'Menus', href: '?path=/docs/navigation-layout-menus--docs' },
  { title: 'Navigation & Layout/Tabs & Pagination', category: 'Navigation & Layout', label: 'Tabs & Pagination', href: '?path=/docs/navigation-layout-tabs-pagination--docs' },
  { title: 'Navigation & Layout/Collapsible', category: 'Navigation & Layout', label: 'Collapsible', href: '?path=/docs/navigation-layout-collapsible--docs' },
  { title: 'Overlays & Utilities/CommandPalette', category: 'Overlays & Utilities', label: 'CommandPalette', href: '?path=/docs/overlays-utilities-commandpalette--docs' },
  { title: 'Overlays & Utilities/Dialogs & Drawers', category: 'Overlays & Utilities', label: 'Dialogs & Drawers', href: '?path=/docs/overlays-utilities-dialogs-drawers--docs' },
  { title: 'Overlays & Utilities/HoverCard', category: 'Overlays & Utilities', label: 'HoverCard', href: '?path=/docs/overlays-utilities-hovercard--docs' },
  { title: 'Overlays & Utilities/Kbd & ScrollArea', category: 'Overlays & Utilities', label: 'Kbd & ScrollArea', href: '?path=/docs/overlays-utilities-kbd-scrollarea--docs' },
  { title: 'Templates/App Shell', category: 'Templates', label: 'App Shell', href: '?path=/story/templates-app-shell--dashboard' },
  { title: 'Templates/Settings Page', category: 'Templates', label: 'Settings Page', href: '?path=/story/templates-settings-page--settings-page' },
];

export function getAdjacentPages(currentTitle: string): { prev?: NavEntry; next?: NavEntry } {
  const idx = NAV_ORDER.findIndex((item) => item.title === currentTitle);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? NAV_ORDER[idx - 1] : undefined,
    next: idx < NAV_ORDER.length - 1 ? NAV_ORDER[idx + 1] : undefined,
  };
}

export const componentRegistry: Record<string, ComponentDocMeta> = {
  'Foundations/Design tokens': {
    packageName: '@yourorg/tokens',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/tokens/src/tokens.json',
    cssPath: 'packages/ui/src/styles/themes.css',
    imports: ['tokens', 'STEPS', 'createTheme'],
    summary: 'OKLCH colour scales, build-verified WCAG AA semantic roles, typography, spacing, radius and elevation tokens.',
    aria: '30 contrast pairs verified',
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Primary brand action & active highlight' },
      { name: '--ui-color-surface', kind: 'color', role: 'Default card & container surface' },
      { name: '--ui-color-border', kind: 'color', role: 'Subtle structural hairline border' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Keyboard focus indicator ring' },
    ],
    themeSnippet: `const acme = createTheme({\n  brand: '#7c3aed',\n  tokens: { radius: { md: '8px' } },\n});`,
  },

  'Foundations/Icons': {
    packageName: '@yourorg/icons',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/icons/src/index.tsx',
    imports: ['SearchIcon', 'CheckIcon', 'PlusIcon', 'createIcon'],
    summary: '40 tree-shakeable 24px stroke SVG icons in a zero-dependency standalone package, plus createIcon() for custom icons.',
    aria: 'aria-hidden decorative · sideEffects: false',
    tokens: [
      { name: '--ui-icon-sm', kind: 'size', role: 'Small icon dimension (16px)' },
      { name: '--ui-icon-md', kind: 'size', role: 'Default medium icon dimension (20px)' },
      { name: '--ui-icon-lg', kind: 'size', role: 'Large icon dimension (24px)' },
    ],
  },

  'Inputs & Actions/Button': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/actions/index.tsx',
    cssPath: 'packages/ui/src/actions/actions.css',
    imports: ['Button', 'IconButton', 'ButtonGroup', 'Link'],
    summary: 'Triggers actions and navigation with four visual weights, three semantic tones, loading states and attached button groups.',
    aria: 'Native <button> · aria-busy',
    keyboard: [
      { keys: ['Tab'], action: 'Move focus to the button' },
      { keys: ['Enter'], action: 'Activate the button or link' },
      { keys: ['Space'], action: 'Activate the button (ignored while loading or disabled)' },
    ],
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Solid accent button fill' },
      { name: '--ui-color-text-on-accent', kind: 'color', role: 'High-contrast label on solid fills' },
      { name: '--ui-color-danger', kind: 'color', role: 'Destructive action fill & outline' },
      { name: '--ui-button-radius', kind: 'radius', role: 'Button corner radius override (defaults to --ui-radius-md)' },
      { name: '--ui-control-md', kind: 'size', role: 'Default medium control height' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Keyboard focus-visible outline' },
    ],
    themeSnippet: `createTheme({ components: { 'button-radius': '999px' } })`,
  },

  'Inputs & Actions/Text & Forms': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/forms/index.tsx',
    cssPath: 'packages/ui/src/forms/forms.css',
    imports: ['Field', 'TextField', 'Textarea', 'Select', 'Combobox', 'NumberField', 'Checkbox', 'RadioGroup', 'Switch', 'Slider'],
    summary: 'Accessible form primitives wired with Field labels, hints, inline errors, adornments and native form submission.',
    aria: 'aria-describedby · aria-invalid',
    keyboard: [
      { keys: ['↑', '↓'], action: 'Navigate Select/Combobox options or step NumberField' },
      { keys: ['Space'], action: 'Toggle Checkbox, Switch, or open Select' },
      { keys: ['Backspace'], action: 'Remove last selected chip in multi-select Combobox' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Input background fill' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Interactive input border' },
      { name: '--ui-color-accent', kind: 'color', role: 'Checked state & slider track fill' },
      { name: '--ui-color-danger-text', kind: 'color', role: 'Inline validation error text & border' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Input & control corner radius' },
      { name: '--ui-control-md', kind: 'size', role: 'Standard 40px control height' },
    ],
  },

  'Inputs & Actions/ColorPicker': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/ui/src/forms/ColorPicker.tsx',
    cssPath: 'packages/ui/src/styles/extra.css',
    imports: ['ColorPicker'],
    summary: 'Accessible hex colour picker with a 2D saturation/brightness area, hue slider, preset swatches and keyboard controls.',
    aria: 'WAI-ARIA Slider · Form name',
    keyboard: [
      { keys: ['←', '→', '↑', '↓'], action: 'Nudge saturation & brightness in the 2D plane' },
      { keys: ['Shift', 'Arrow'], action: 'Move 10% increments in the colour plane' },
      { keys: ['Esc'], action: 'Close the colour popover and return focus to trigger' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Trigger & popover surface' },
      { name: '--ui-color-border', kind: 'color', role: 'Popover & swatch hairline border' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Thumb & swatch focus ring' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Trigger & swatch radius' },
      { name: '--ui-shadow-md', kind: 'shadow', role: 'Floating popover elevation' },
    ],
  },

  'Inputs & Actions/Date & Time Pickers': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/forms/pickers.tsx',
    cssPath: 'packages/ui/src/forms/more.css',
    imports: ['DatePicker', 'DateRangePicker', 'TimePicker', 'Calendar'],
    summary: 'Locale-aware calendar, range and time pickers with controlled open state and disabled-date predicates.',
    aria: 'WAI-ARIA Grid · Intl formatted',
    keyboard: [
      { keys: ['←', '→', '↑', '↓'], action: 'Move focus by day or week inside the Calendar grid' },
      { keys: ['PageUp', 'PageDown'], action: 'Navigate to previous or next month' },
      { keys: ['Enter'], action: 'Select the focused date or range endpoint' },
    ],
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Selected date & range endpoints' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'In-range day highlight' },
      { name: '--ui-color-surface', kind: 'color', role: 'Calendar popover surface' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Day cell & popover radius' },
    ],
  },

  'Inputs & Actions/FileUpload': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/forms/inputs.tsx',
    cssPath: 'packages/ui/src/forms/more.css',
    imports: ['FileUpload'],
    summary: 'Drag-and-drop and click-to-browse file uploader with size/type validation and removable file list.',
    aria: 'Keyboard dropzone · Live errors',
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Open the system file chooser from the dropzone' },
      { keys: ['Tab'], action: 'Navigate to remove buttons for uploaded files' },
    ],
    tokens: [
      { name: '--ui-color-surface-subtle', kind: 'color', role: 'Dropzone idle background' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Active drag-over surface' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Dashed dropzone border' },
      { name: '--ui-radius-lg', kind: 'radius', role: 'Dropzone container radius' },
    ],
  },

  'Inputs & Actions/PinInput': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/forms/inputs.tsx',
    cssPath: 'packages/ui/src/forms/more.css',
    imports: ['PinInput'],
    summary: 'One-time code input supporting auto-advance, paste splitting, backspace navigation and optional masking.',
    aria: 'autoComplete="one-time-code"',
    keyboard: [
      { keys: ['0-9'], action: 'Enter digit and automatically advance to next cell' },
      { keys: ['Backspace'], action: 'Clear current cell or step back to previous cell' },
      { keys: ['⌘', 'V'], action: 'Paste a full code across all cells automatically' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Digit cell fill' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Cell outline' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Active digit focus ring' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Cell corner radius' },
    ],
  },

  'Inputs & Actions/Rating': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/forms/inputs.tsx',
    cssPath: 'packages/ui/src/forms/more.css',
    imports: ['Rating'],
    summary: 'Keyboard-navigable star rating radio group with hover preview, read-only mode and optional allowClear.',
    aria: 'WAI-ARIA RadioGroup',
    keyboard: [
      { keys: ['←', '→'], action: 'Decrease or increase star rating' },
      { keys: ['Home', 'End'], action: 'Jump to minimum or maximum rating' },
    ],
    tokens: [
      { name: '--ui-color-warning', kind: 'color', role: 'Filled star highlight' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Unfilled star stroke' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Focus ring around active star' },
    ],
  },

  'Inputs & Actions/SegmentedControl': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/forms/inputs.tsx',
    cssPath: 'packages/ui/src/forms/more.css',
    imports: ['SegmentedControl', 'ToggleGroup'],
    summary: 'Compact single-selection view switcher and multi/single toggle button group.',
    aria: 'Roving tabindex · aria-checked',
    keyboard: [
      { keys: ['←', '→'], action: 'Move selection between segments' },
      { keys: ['Space', 'Enter'], action: 'Toggle focused item in ToggleGroup' },
    ],
    tokens: [
      { name: '--ui-color-surface-muted', kind: 'color', role: 'Segmented track background' },
      { name: '--ui-color-surface', kind: 'color', role: 'Active segment surface' },
      { name: '--ui-shadow-xs', kind: 'shadow', role: 'Active segment lift' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Track & thumb radius' },
    ],
  },

  'Data Display/DataTable': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/ui/src/data/DataTable.tsx',
    cssPath: 'packages/ui/src/styles/extra.css',
    imports: ['DataTable'],
    summary: 'Full-featured data grid built on Table and Pagination with live search, column sorting, row selection and bulk actions.',
    aria: 'aria-sort · Accessible caption',
    keyboard: [
      { keys: ['Tab'], action: 'Move between search input, sortable column headers, checkboxes and pager' },
      { keys: ['Enter', 'Space'], action: 'Toggle column sort direction or select focused row' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Table body background' },
      { name: '--ui-color-surface-subtle', kind: 'color', role: 'Header & bulk-action bar fill' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Selected row tint' },
      { name: '--ui-color-border', kind: 'color', role: 'Row & frame divider lines' },
      { name: '--ui-radius-lg', kind: 'radius', role: 'Outer table container radius' },
    ],
  },

  'Data Display/Carousel': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/ui/src/data/Carousel.tsx',
    cssPath: 'packages/ui/src/styles/extra.css',
    imports: ['Carousel'],
    summary: 'Accessible slideshow with unified footer controls, dot indicators, arrow keys, swipe gestures and reduced-motion-safe auto-play.',
    aria: 'aria-roledescription="carousel"',
    keyboard: [
      { keys: ['←', '→'], action: 'Navigate to previous or next slide when carousel has focus' },
      { keys: ['Home', 'End'], action: 'Jump directly to first or last slide' },
    ],
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Active slide indicator pill' },
      { name: '--ui-color-surface', kind: 'color', role: 'Previous / Next control fill' },
      { name: '--ui-color-border', kind: 'color', role: 'Control button border' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Keyboard focus outline' },
    ],
  },

  'Data Display/Tables & Cards': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/data/index.tsx',
    cssPath: 'packages/ui/src/data/data.css',
    imports: ['Table', 'Card', 'Badge', 'Tag', 'Avatar', 'Accordion', 'EmptyState'],
    summary: 'Core data presentation primitives: sortable Table, multi-surface Card, semantic Badges, removable Tags, Avatars and Accordion.',
    aria: 'Semantic tables · aria-expanded',
    keyboard: [
      { keys: ['↑', '↓'], action: 'Move between Accordion triggers' },
      { keys: ['Enter', 'Space'], action: 'Expand/collapse Accordion item or trigger interactive Table row' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Default card & table surface' },
      { name: '--ui-card-radius', kind: 'radius', role: 'Card corner radius override (defaults to --ui-radius-lg)' },
      { name: '--ui-color-border', kind: 'color', role: 'Card & row borders' },
      { name: '--ui-shadow-md', kind: 'shadow', role: 'Elevated card shadow' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Subtle badge & tag fill' },
    ],
    themeSnippet: `createTheme({ components: { 'card-radius': '16px' } })`,
  },

  'Data Display/DescriptionList': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/more.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['DescriptionList'],
    summary: 'Structured key-value metadata grid built on semantic <dl>, <dt> and <dd> elements.',
    aria: 'Semantic <dl> list',
    tokens: [
      { name: '--ui-color-text-secondary', kind: 'color', role: 'Term label colour' },
      { name: '--ui-color-text-primary', kind: 'color', role: 'Definition value colour' },
      { name: '--ui-color-border', kind: 'color', role: 'Row separator rule' },
    ],
  },

  'Data Display/Stat': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/more.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['Stat'],
    summary: 'KPI metric readout with responsive typography, optional icon and positive/negative trend delta indicators.',
    aria: 'Semantic trend wording',
    tokens: [
      { name: '--ui-color-text-primary', kind: 'color', role: 'Primary KPI figure' },
      { name: '--ui-color-success-text', kind: 'color', role: 'Positive trend delta' },
      { name: '--ui-color-danger-text', kind: 'color', role: 'Negative trend delta' },
      { name: '--ui-color-text-secondary', kind: 'color', role: 'Label & comparison period' },
    ],
  },

  'Data Display/Timeline': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/more.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['Timeline'],
    summary: 'Chronological vertical event feed with semantic tone markers, custom icons and timestamps.',
    aria: 'Semantic <ol> feed',
    tokens: [
      { name: '--ui-color-border-strong', kind: 'color', role: 'Vertical connector rail' },
      { name: '--ui-color-accent', kind: 'color', role: 'Accent milestone node' },
      { name: '--ui-color-success', kind: 'color', role: 'Success milestone node' },
    ],
  },

  'Data Display/TreeView': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/more.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['TreeView'],
    summary: 'Hierarchical tree with full WAI-ARIA keyboard support (Arrow keys, Home/End, * expand-all and type-ahead search).',
    aria: 'WAI-ARIA TreeView · Type-ahead',
    keyboard: [
      { keys: ['↑', '↓'], action: 'Move focus between visible tree nodes' },
      { keys: ['→', '←'], action: 'Expand/enter branch or collapse/move to parent' },
      { keys: ['*'], action: 'Expand all sibling branches at the current level' },
      { keys: ['A-Z'], action: 'Type-ahead focus jump to matching node label' },
    ],
    tokens: [
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Selected tree row highlight' },
      { name: '--ui-color-accent-text', kind: 'color', role: 'Selected row label' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Active focus outline' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Row hover & selection radius' },
    ],
  },

  'Feedback/Banner': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/ui/src/feedback/Banner.tsx',
    cssPath: 'packages/ui/src/styles/extra.css',
    imports: ['Banner'],
    summary: 'Full-width announcement strip for workspace-wide alerts in subtle or solid emphasis, with optional sticky positioning and dismiss.',
    aria: 'role="region" / status live',
    keyboard: [
      { keys: ['Tab'], action: 'Focus the banner action button or dismiss button' },
      { keys: ['Enter', 'Space'], action: 'Activate action or dismiss the banner' },
    ],
    tokens: [
      { name: '--ui-color-info-subtle', kind: 'color', role: 'Subtle info banner fill' },
      { name: '--ui-color-accent', kind: 'color', role: 'Solid accent banner fill' },
      { name: '--ui-color-danger', kind: 'color', role: 'Solid danger banner fill' },
      { name: '--ui-color-success', kind: 'color', role: 'Solid success banner fill' },
    ],
  },

  'Feedback/Alerts & Toasts': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/feedback/index.tsx',
    cssPath: 'packages/ui/src/feedback/feedback.css',
    imports: ['Alert', 'Toaster', 'toast', 'Progress', 'Spinner', 'Skeleton'],
    summary: 'Inline Alerts, imperative toast notifications (including toast.promise), Progress bars, Spinners and Skeletons.',
    aria: 'ARIA live regions · progressbar',
    tokens: [
      { name: '--ui-color-info-subtle', kind: 'color', role: 'Info alert background' },
      { name: '--ui-color-success-subtle', kind: 'color', role: 'Success alert background' },
      { name: '--ui-color-warning-subtle', kind: 'color', role: 'Warning alert background' },
      { name: '--ui-color-danger-subtle', kind: 'color', role: 'Danger alert background' },
      { name: '--ui-color-accent', kind: 'color', role: 'Progress indicator fill' },
    ],
  },

  'Navigation & Layout/Resizable': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.3',
    sourcePath: 'packages/ui/src/layout/Resizable.tsx',
    cssPath: 'packages/ui/src/styles/extra.css',
    imports: ['Resizable'],
    summary: 'Nested horizontal and vertical split-pane layouts with pointer dragging and WAI-ARIA window-splitter keyboard controls.',
    aria: 'role="separator" · Arrow/Enter',
    keyboard: [
      { keys: ['←', '→', '↑', '↓'], action: 'Resize adjacent panes by 2% increments' },
      { keys: ['Shift', 'Arrow'], action: 'Resize panes rapidly by 10% increments' },
      { keys: ['Home', 'End'], action: 'Collapse pane to minimum or expand to maximum size' },
      { keys: ['Enter'], action: 'Reset panes back to defaultSizes (or double-click handle)' },
    ],
    tokens: [
      { name: '--ui-color-surface-subtle', kind: 'color', role: 'Split handle track fill' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Centered grip pill indicator' },
      { name: '--ui-color-accent', kind: 'color', role: 'Active drag / hover grip highlight' },
      { name: '--ui-color-focus-ring', kind: 'color', role: 'Keyboard focus outline' },
    ],
  },

  'Navigation & Layout/Sidebar': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/navigation/Sidebar.tsx',
    cssPath: 'packages/ui/src/navigation/more.css',
    imports: ['Sidebar', 'useSidebar'],
    summary: 'Collapsible application navigation rail supporting grouped links, nested submenus, badge counters and Drawer pairing on mobile.',
    aria: 'aria-current="page" · aria-expanded',
    keyboard: [
      { keys: ['Tab'], action: 'Navigate through Sidebar items, submenus and toggle button' },
      { keys: ['Enter', 'Space'], action: 'Activate route or expand/collapse Sidebar.Submenu' },
    ],
    tokens: [
      { name: '--ui-sidebar-width', kind: 'size', role: 'Expanded sidebar width (248px)' },
      { name: '--ui-sidebar-collapsed-width', kind: 'size', role: 'Icon-only collapsed width (64px)' },
      { name: '--ui-color-surface-subtle', kind: 'color', role: 'Sidebar rail background' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Active navigation item highlight' },
    ],
    themeSnippet: `createTheme({ components: { 'sidebar-width': '272px' } })`,
  },

  'Navigation & Layout/Stepper': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/navigation/Stepper.tsx',
    cssPath: 'packages/ui/src/navigation/more.css',
    imports: ['Stepper'],
    summary: 'Horizontal and vertical multi-step progress indicator with optional interactive step selection and custom icons.',
    aria: 'aria-current="step"',
    keyboard: [
      { keys: ['Tab'], action: 'Focus completed or clickable steps when onStepClick is provided' },
      { keys: ['Enter', 'Space'], action: 'Jump to the focused step' },
    ],
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Completed & active step badge' },
      { name: '--ui-color-border', kind: 'color', role: 'Pending connector line' },
      { name: '--ui-color-text-secondary', kind: 'color', role: 'Step subtitle description' },
    ],
  },

  'Navigation & Layout/Menus': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/overlays/menus.tsx',
    cssPath: 'packages/ui/src/overlays/more.css',
    imports: ['Menubar', 'ContextMenu'],
    summary: 'Desktop-style top Menubar and right-click ContextMenu built on Radix menu primitives with keyboard shortcuts.',
    aria: 'WAI-ARIA Menubar & Menu',
    keyboard: [
      { keys: ['←', '→'], action: 'Switch between top-level menus or open/close submenus' },
      { keys: ['↑', '↓'], action: 'Move focus across menu items' },
      { keys: ['Shift', 'F10'], action: 'Open ContextMenu on the focused target' },
      { keys: ['Esc'], action: 'Dismiss open menu and restore focus' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Menu surface fill' },
      { name: '--ui-color-border', kind: 'color', role: 'Menu border & separators' },
      { name: '--ui-shadow-md', kind: 'shadow', role: 'Floating menu elevation' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Menu & item corner radius' },
    ],
  },

  'Navigation & Layout/Tabs & Pagination': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/navigation/index.tsx',
    cssPath: 'packages/ui/src/navigation/navigation.css',
    imports: ['Tabs', 'Breadcrumbs', 'Pagination'],
    summary: 'Line and pill Tabs, semantic Breadcrumbs trail, and controlled/uncontrolled Pagination.',
    aria: 'WAI-ARIA Tabs · nav landmarks',
    keyboard: [
      { keys: ['←', '→'], action: 'Move between tab triggers in Tabs.List' },
      { keys: ['Home', 'End'], action: 'Jump to first or last enabled tab' },
    ],
    tokens: [
      { name: '--ui-color-accent', kind: 'color', role: 'Active tab indicator & current page pill' },
      { name: '--ui-color-surface-muted', kind: 'color', role: 'Pill tabs track fill' },
      { name: '--ui-color-border', kind: 'color', role: 'Line tabs baseline divider' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Pagination & pill tab radius' },
    ],
  },

  'Navigation & Layout/Collapsible': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/Collapsible.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['Collapsible'],
    summary: 'Single disclosure section for progressively revealing secondary form controls or advanced settings.',
    aria: 'aria-expanded · aria-controls',
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggle open or collapsed state' },
    ],
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Disclosure panel surface' },
      { name: '--ui-color-border', kind: 'color', role: 'Disclosure border' },
      { name: '--ui-radius-md', kind: 'radius', role: 'Trigger & container radius' },
    ],
  },

  'Overlays & Utilities/CommandPalette': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/overlays/more.tsx',
    cssPath: 'packages/ui/src/overlays/more.css',
    imports: ['CommandPalette'],
    summary: '⌘K / Ctrl+K quick-action launcher with grouped fuzzy search, keyword matching and keyboard navigation.',
    aria: 'Modal combobox · ⌘K shortcut',
    keyboard: [
      { keys: ['⌘', 'K'], action: 'Toggle the command palette from anywhere (Ctrl+K on Windows/Linux)' },
      { keys: ['↑', '↓'], action: 'Highlight previous or next matching command' },
      { keys: ['Enter'], action: 'Execute the highlighted command' },
      { keys: ['Esc'], action: 'Close palette and return focus' },
    ],
    tokens: [
      { name: '--ui-color-overlay', kind: 'color', role: 'Backdrop scrim colour' },
      { name: '--ui-color-surface', kind: 'color', role: 'Palette modal background' },
      { name: '--ui-color-accent-subtle', kind: 'color', role: 'Highlighted command row' },
      { name: '--ui-shadow-lg', kind: 'shadow', role: 'Modal elevation' },
    ],
  },

  'Overlays & Utilities/Dialogs & Drawers': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.1',
    sourcePath: 'packages/ui/src/overlays/index.tsx',
    cssPath: 'packages/ui/src/overlays/overlays.css',
    imports: ['Dialog', 'AlertDialog', 'Drawer', 'Popover', 'Tooltip', 'DropdownMenu'],
    summary: 'Focus-trapped modals, destructive confirmations, edge Drawers, Popovers, Tooltips and DropdownMenus with submenus.',
    aria: 'Focus trap · Escape · Portal',
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Cycle focus safely inside modal Dialog / AlertDialog / Drawer' },
      { keys: ['Esc'], action: 'Dismiss Dialog, Drawer, Popover, Tooltip or DropdownMenu' },
    ],
    tokens: [
      { name: '--ui-color-overlay', kind: 'color', role: 'Modal & drawer backdrop scrim' },
      { name: '--ui-color-surface', kind: 'color', role: 'Overlay container surface' },
      { name: '--ui-radius-lg', kind: 'radius', role: 'Dialog & drawer corner radius' },
      { name: '--ui-shadow-lg', kind: 'shadow', role: 'Overlay elevation shadow' },
    ],
  },

  'Overlays & Utilities/HoverCard': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/overlays/more.tsx',
    cssPath: 'packages/ui/src/overlays/more.css',
    imports: ['HoverCard'],
    summary: 'Pointer preview card anchored to a trigger link for non-essential supplementary details.',
    aria: 'Pointer preview only',
    tokens: [
      { name: '--ui-color-surface', kind: 'color', role: 'Floating card background' },
      { name: '--ui-color-border', kind: 'color', role: 'Card border' },
      { name: '--ui-shadow-md', kind: 'shadow', role: 'Card shadow' },
      { name: '--ui-radius-lg', kind: 'radius', role: 'Card corner radius' },
    ],
  },

  'Overlays & Utilities/Kbd & ScrollArea': {
    packageName: '@yourorg/ui',
    version: CURRENT_VERSION,
    since: 'v0.2',
    sourcePath: 'packages/ui/src/data/more.tsx',
    cssPath: 'packages/ui/src/data/more.css',
    imports: ['Kbd', 'ScrollArea'],
    summary: 'Keyboard keycap badge (<kbd>) and lightweight native custom-scrollbar ScrollArea.',
    aria: 'Native <kbd> · Focusable scroll',
    tokens: [
      { name: '--ui-color-surface-subtle', kind: 'color', role: 'Keycap background' },
      { name: '--ui-color-border-strong', kind: 'color', role: 'Keycap edge & scrollbar thumb' },
      { name: '--ui-radius-sm', kind: 'radius', role: 'Keycap corner radius' },
    ],
  },
};
