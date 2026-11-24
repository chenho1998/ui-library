// Theme
export { ThemeProvider, useTheme, useLocale, usePortalContainer, getThemeScript, defaultLocale } from './theme/ThemeProvider';
export type { ThemeProviderProps, ColorScheme, Locale } from './theme/ThemeProvider';
export { createTheme, withFont } from './theme/createTheme';
export type { Theme, ThemeOptions, WithFontOptions } from './theme/createTheme';
export { FONT_STACKS } from './theme/fonts';
export { animeTheme, pixelTheme, brutalistTheme, sketchTheme, neonTheme } from './theme/themes';

// Layout and type
export * from './layout';
// Icons (from @yourorg/icons; named re-exports preserve full tree-shaking)
export {
  createIcon,
  type IconProps,
  CheckIcon, MinusIcon, PlusIcon, XIcon,
  ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon,
  ArrowUpIcon, ArrowDownIcon, SearchIcon,
  InfoIcon, SuccessIcon, WarningIcon, DangerIcon,
  CalendarIcon, MoreIcon, InboxIcon,
  HomeIcon, SettingsIcon, UsersIcon, FolderIcon, FileIcon, ChartIcon, BellIcon, ClockIcon, UploadIcon, StarIcon, MenuIcon, PanelLeftIcon,
  CopyIcon, TrashIcon, EditIcon, FilterIcon, SunIcon, MoonIcon, EyeIcon, EyeOffIcon, ExternalLinkIcon, RefreshIcon,
} from '@yourorg/icons';
// Actions
export * from './actions';
// Forms
export * from './forms';
// Overlays
export * from './overlays';
// Feedback
export * from './feedback';
// Navigation
export * from './navigation';
// Data display
export * from './data';
// More components: navigation, inputs, overlays and utilities, data display, pickers
export { Sidebar, useSidebar, type SidebarProps, type SidebarItemProps, type SidebarGroupProps, type SidebarSubmenuProps } from './navigation/Sidebar';
export { Stepper, type StepperProps, type StepperStep } from './navigation/Stepper';
export { ContextMenu, Menubar } from './overlays/menus';
export { CommandPalette, HoverCard, Kbd, ScrollArea, type CommandItem, type CommandPaletteProps, type ScrollAreaProps } from './overlays/more';
export {
  SegmentedControl, ToggleGroup, PinInput, FileUpload, Rating,
  type SegmentedControlProps, type SegmentedControlItem, type ToggleGroupProps, type PinInputProps, type FileUploadProps, type RatingProps,
} from './forms/inputs';
export { TimePicker, DateRangePicker, type TimePickerProps, type DateRangePickerProps, type DateRange } from './forms/pickers';
export { Collapsible, type CollapsibleProps } from './data/Collapsible';
export {
  Timeline, TreeView, Stat, DescriptionList,
  type TimelineItemProps, type TreeNode, type TreeViewProps, type StatProps, type DescriptionListProps, type DescriptionItemProps,
} from './data/more';
export { DataTable, type DataTableProps, type DataTableColumn } from './data/DataTable';
export { Carousel, type CarouselProps, type CarouselSlideProps } from './data/Carousel';
export { ColorPicker, type ColorPickerProps } from './forms/ColorPicker';
export { Resizable, type ResizableProps, type ResizablePanelProps, type ResizableHandleProps } from './layout/Resizable';
export { Banner, type BannerProps } from './feedback/Banner';
// Utilities
export { cx, mergeRefs, useControllableState } from './utils';
export type { Size, Tone } from './utils';
