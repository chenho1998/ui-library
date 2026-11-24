import * as React from 'react';
import { cx } from '../utils';
import type { Theme } from './createTheme';

export type ColorScheme = 'light' | 'dark' | 'system';

export interface Locale {
  close: string;
  loading: string;
  selectPlaceholder: string;
  noResults: string;
  empty: string;
  required: string;
  breadcrumb: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  page: (n: number) => string;
  notifications: string;
  dismiss: string;
  increment: string;
  decrement: string;
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  selectAll: string;
  selectRow: (name: string) => string;
  characterCount: (count: number, max: number) => string;
  /** Announced as Combobox results change. */
  results: (count: number) => string;
  /** Label for the button that removes one selected value (Combobox, Tag). */
  removeItem: (label: string) => string;
  // Strings for the v0.2 components. Optional: their English defaults live in each component, so a bundle only
  // carries the strings of the components it uses. Set them here to translate.
  collapseSidebar?: string;
  expandSidebar?: string;
  /** Step status words read after each Stepper step. */
  stepStatus?: { complete: string; current: string; upcoming: string };
  /** Command palette search box. */
  commandPlaceholder?: string;
  /** FileUpload drop zone. */
  dropFiles?: string;
  browseFiles?: string;
  /** Rating: accessible label for each star, e.g. "3 of 5 stars". */
  ratingValue?: (value: number, max: number) => string;
  /** PinInput: accessible label for each box. */
  pinDigit?: (index: number, length: number) => string;
  /** TimePicker and DateRangePicker. */
  chooseTime?: string;
  hours?: string;
  minutes?: string;
  startDate?: string;
  endDate?: string;
}

export const defaultLocale: Locale = {
  close: 'Close',
  loading: 'Loading',
  selectPlaceholder: 'Select…',
  noResults: 'No results',
  empty: 'No data',
  required: 'required',
  breadcrumb: 'Breadcrumb',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n) => `Page ${n}`,
  notifications: 'Notifications',
  dismiss: 'Dismiss',
  increment: 'Increase',
  decrement: 'Decrease',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseDate: 'Choose date',
  selectAll: 'Select all rows',
  selectRow: (name) => `Select ${name}`,
  characterCount: (count, max) => `${count} of ${max} characters`,
  results: (count) => (count === 1 ? '1 result' : `${count} results`),
  removeItem: (label) => `Remove ${label}`,
};

interface ThemeContextValue {
  colorScheme: ColorScheme;
  resolvedColorScheme: 'light' | 'dark';
  setColorScheme: (scheme: ColorScheme) => void;
  localeOverrides: Partial<Locale>;
  portalContainer: HTMLElement | null;
}

const EMPTY_LOCALE: Partial<Locale> = {};

const ThemeContext = /* @__PURE__ */ React.createContext<ThemeContextValue>({
  colorScheme: 'light',
  resolvedColorScheme: 'light',
  setColorScheme: () => {},
  localeOverrides: EMPTY_LOCALE,
  portalContainer: null,
});

export const useTheme = () => {
  const { colorScheme, resolvedColorScheme, setColorScheme, portalContainer, localeOverrides } = React.useContext(ThemeContext);
  const locale = React.useMemo(() => ({ ...defaultLocale, ...localeOverrides }), [localeOverrides]);
  return React.useMemo(
    () => ({ colorScheme, resolvedColorScheme, setColorScheme, portalContainer, locale }),
    [colorScheme, resolvedColorScheme, setColorScheme, portalContainer, locale],
  );
};
export const useLocale = () => {
  const overrides = React.useContext(ThemeContext).localeOverrides;
  return React.useMemo(() => ({ ...defaultLocale, ...overrides }), [overrides]);
};
/** Internal hook returning only caller-supplied locale overrides, so single-component bundles omit unused defaults. */
export const useLocaleOverrides = () => React.useContext(ThemeContext).localeOverrides;
/** Container that overlays portal into, so they inherit the theme's CSS variables. */
export const usePortalContainer = () => React.useContext(ThemeContext).portalContainer ?? undefined;

const DARK_QUERY = '(prefers-color-scheme: dark)';
const darkQuery = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(DARK_QUERY) : null);
const subscribeToScheme = (onChange: () => void) => {
  const mq = darkQuery();
  mq?.addEventListener?.('change', onChange);
  return () => mq?.removeEventListener?.('change', onChange);
};

function useSystemScheme(): 'light' | 'dark' {
  const dark = React.useSyncExternalStore(
    subscribeToScheme,
    () => darkQuery()?.matches ?? false,
    () => false, // server render: light until hydrated (getThemeScript avoids the flash)
  );
  return dark ? 'dark' : 'light';
}

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A theme from `createTheme()`. Omit for the default theme. */
  theme?: Theme;
  /** Colour scheme; `system` follows the operating system. Uncontrolled if `defaultColorScheme` is used. */
  colorScheme?: ColorScheme;
  /** Initial scheme when uncontrolled. Default `'system'`. */
  defaultColorScheme?: ColorScheme;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Persist the user's choice in localStorage under this key (pair with `getThemeScript`). */
  storageKey?: string;
  /** Override any user-visible strings (labels for close buttons, pagination, etc.). */
  locale?: Partial<Locale>;
}

/**
 * Applies tokens, colour scheme and locale to everything inside it.
 * Nest providers to theme part of a page differently (e.g. a dark sidebar).
 */
export const ThemeProvider = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  {
    theme,
    colorScheme: controlled,
    defaultColorScheme = 'system',
    onColorSchemeChange,
    storageKey,
    locale,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = React.useState<ColorScheme>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(storageKey) as ColorScheme | null;
        if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
      } catch {
        /* storage unavailable */
      }
    }
    return defaultColorScheme;
  });
  const colorScheme = controlled ?? uncontrolled;
  const system = useSystemScheme();
  const resolvedColorScheme = colorScheme === 'system' ? system : colorScheme;

  const setColorScheme = React.useCallback(
    (next: ColorScheme) => {
      if (controlled === undefined) setUncontrolled(next);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          /* storage unavailable */
        }
      }
      onColorSchemeChange?.(next);
    },
    [controlled, storageKey, onColorSchemeChange],
  );

  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const localeOverrides = locale ?? EMPTY_LOCALE;
  const value = React.useMemo(
    () => ({ colorScheme, resolvedColorScheme, setColorScheme, localeOverrides, portalContainer }),
    [colorScheme, resolvedColorScheme, setColorScheme, localeOverrides, portalContainer],
  );

  const themeStyle = React.useMemo(
    () => ({ ...theme?.vars, ...theme?.schemes[resolvedColorScheme], ...style }) as React.CSSProperties,
    [theme, resolvedColorScheme, style],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div ref={ref} data-theme={colorScheme} data-ui-style={theme?.style} className={cx('ui-theme', className)} style={themeStyle} {...rest}>
        {children}
        <div ref={setPortalContainer} data-ui-portal-root="" />
      </div>
    </ThemeContext.Provider>
  );
});

/**
 * Inline script for the document <head> that applies the saved colour scheme before first paint.
 * Use with `storageKey` and set `data-theme` on the element that wraps your app.
 */
export function getThemeScript(storageKey = 'ui-color-scheme', fallback: ColorScheme = 'system') {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(
    fallback,
  )};document.documentElement.setAttribute('data-theme',s);}catch(e){}})();`;
}
